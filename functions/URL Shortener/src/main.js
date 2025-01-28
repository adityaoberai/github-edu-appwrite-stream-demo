
import AppwriteService from './appwrite.js';
import { getStaticFile } from './utils.js';

export default async ({ req, res, log, error }) => {

  const appwriteService = new AppwriteService(req.headers['x-appwrite-key']);

  if(req.method === 'POST') {

    const output = await appwriteService.createUrlDocument(req);
    return res.json(output);
  }

  else if(req.method === 'GET') {
    try {
      let file = '';
      let contentHeader = '';

      switch (req.path) { 
        case '/':
          file = 'index.html';
          contentHeader = 'text/html';
          break;
        
        case '/styles':
          file = 'styles.css';
          contentHeader = 'text/css';
          break;

        case '/listUrls':
          return res.json(await appwriteService.getUrlList());

        default:
          const output = await appwriteService.getUrlDocument(req.path.substring(1));
          if(output.ok) {
            return res.redirect(output.url, 302);
          } else {
            return res.text('404 Not Found', 404);
          }
      }

      return res.text(getStaticFile(file), 200, { 'Content-Type': contentHeader });
    } catch (err) {
      error(err);
      return res.text('404 Not Found', 404);
    }
  }

  else {
    return res.text('Method Not Allowed', 405);
  }
};
