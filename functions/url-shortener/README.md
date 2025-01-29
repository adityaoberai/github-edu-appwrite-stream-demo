# URL Shortener

A URL shortener app that offers a landing page, creation of short links, listing of all store URLs, and copy and delete actions for all short URLs

## 🧰 Usage

### GET `/`

- Returns an HTML landing page as a static file.

### GET `/styles`

- Returns an CSS file for the HTML landing page as a static file.

### GET `/:shortCode`

- Redirects to the full URL affiliated with the short code.

### GET `/listUrls`

- Gets list of all stored URLs and short codes.

**Response**

Sample `200` Response:

```json
{
  "ok": true,
  "data": [
    {
      "url": "https://appwrite.io",
      "$id": "appwrite"
    },
    {
      "url": "https://twitter.com/adityaoberai1",
      "$id": "twitter"
    },
    {
      "url": "https://appwrite.io/education",
      "$id": "edu"
    }
  ]
}
```

### POST `/`

- Add URL and short code (as the document ID) to the database.

**Request**

```json
{
  "short": "appwrite",
  "url": "https://appwrite.io" 
}
```

**Response**

Sample `200` Response:

```json
{
  "ok": true,
  "data": {
    "short": "appwrite",
    "url": "https://appwrite.io"
  }
}
```

### DELETE `/:shortCode`

- Deletes the short code and affiliated full URL from the database.

**Response**

Sample `200` Response:

```json
{
  "ok": true
}
```

## ⚙️ Configuration

| Setting           | Value         |
| ----------------- | ------------- |
| Runtime           | Node (22.0)   |
| Entrypoint        | `src/main.js` |
| Build Commands    | `npm install` |
| Permissions       | `any`         |
| Timeout (Seconds) | 15            |
| Specifiation      | s-1vcpu-512mb |
| Scopes            | `databases.write`, `databases.read`, `collections.write`,  `collections.read`, `attributes.write`, `documents.write`, `documents.read` |

## 🔒 Environment Variables

No environment variables required mandatorily. There are two **optional** environment variables, however:

- `APPWRITE_DB_ID`: ID of Appwrite Database which will contain collection of short codes and URLs
- `APPWRITE_COLLECTION_ID`: ID of Appwrite Collection which will contain short codes and URLs
