import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

export function throwIfMissing(obj, keys) {
    const missing = [];
    for (let key of keys) {
        if (!(key in obj) || !obj[key]) {
            missing.push(key);
        }
    }
    if (missing.length > 0) {
        throw new Error(`Missing required fields: ${missing.join(', ')}`);
    }
}

export function getStaticFile(fileName) {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const staticFolder = path.join(__dirname, '../static');
    return fs.readFileSync(path.join(staticFolder, fileName)).toString();
}