import { Client, Databases, Query } from 'node-appwrite';
import { throwIfMissing } from './utils.js';

const databaseId = process.env.APPWRITE_DB_ID ?? 'urlDb';
const collectionId = process.env.APPWRITE_COLLECTION_ID ?? 'urls';

class AppwriteService {
    constructor(apiKey) {
        const client = new Client()
            .setEndpoint(process.env.APPWRITE_FUNCTION_API_ENDPOINT)
            .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
            .setKey(apiKey);
        
        this.databases = new Databases(client);

        this.setupUrlDatabase();
    }

    async setupUrlDatabase() {
        const dbExists = await this.doesUrlDatabaseExist();
        if(!dbExists)
        {
            await this.createUrlDatabase();
        }

        const collectionExists = await this.doesUrlCollectionExist();
        if(!collectionExists)
        {
            await this.createUrlCollection();
        }
    }

    async doesUrlDatabaseExist() {
        try {
            await this.databases.get(databaseId);
            return true;
        } catch (err) {
            if (err.code !== 404) throw err;
            return false;
        }
    }

    async createUrlDatabase() {
        try {
            await this.databases.create(databaseId, 'URL Database');
        } catch (err) {
            if (err.code !== 409) throw err;
        }
    }

    async doesUrlCollectionExist() {
        try {
            await this.databases.getCollection(databaseId, collectionId);
            return true;
        } catch (err) {
            if (err.code !== 404) throw err;
            return false;
        }
    }

    async createUrlCollection() {
        try {
            await this.databases.createCollection(databaseId, collectionId, 'URLs');
        } catch (err) {
            if (err.code !== 409) throw err;
        }

        try {
            await this.databases.createStringAttribute(databaseId, collectionId, 'url', 2000, true, undefined, false, false);
        } catch (err) {
            if (err.code !== 409) throw err;
        }
    }

    async createUrlDocument(req) {
        try {
            throwIfMissing(req.bodyJson, ['url', 'short']);
            const { url, short } = req.bodyJson;

            if(short === 'listUrls') {
                throw new Error('Short code is reserved');
            }

            if(short.length < 3) {
                throw new Error('Short code must be at least 3 characters long');
            }

            if((await this.getUrlDocument(short)).ok) {
                throw new Error('Short code already exists');
            }
            
            await this.databases.createDocument(databaseId, collectionId, short, { url });

            return {
                ok: true,
                data: {
                    short,
                    url
                }
            }
        } catch (err) {
            return {
                ok: false,
                error: err.message
            }
        }
    }

    async deleteUrlDocument(short) {
        try {
            if(!(await this.getUrlDocument(short)).ok) {
                throw new Error('Short URL does not exist');
            }

            await this.databases.deleteDocument(databaseId, collectionId, short);
            return {
                ok: true
            };
        } catch (err) {
            return {
                ok: false,
                error: err.message
            };
        }
    }

    async getUrlDocument(short) {
        try {
            const urlDocument = await this.databases.getDocument(databaseId, collectionId, short);
            return {
                ok: true,
                url: urlDocument.url
            };
        } catch (err) {
            return {
                ok: false,
                error: err.message
            };
        }
    }

    async getUrlList() {
        try {
            const urlList = await this.databases.listDocuments(databaseId, collectionId, [Query.select(['$id', 'url'])]);
            return {
                ok: true,
                data: urlList.documents
            };
        } catch (err) {
            return {
                ok: false,
                error: err.message
            };
        }
    }
}

export default AppwriteService;