// _worker.js
import { Hono } from 'hono';
import { renderToReadableStream } from '@nordcraft/ssr';
import projectData from './nordcraft-export-blue_dooku_main_takin-main.json';

// Initialisation de l'application Hono
const app = new Hono();

// Route qui capture toutes les requêtes
app.all('*', async (c) => {
  try {
    // Génération du flux HTML à partir de votre design Nordcraft
    const htmlStream = await renderToReadableStream(projectData, {
      title: 'Mon App Nordcraft',
      lang: 'fr',
      // Note : Le script client est optionnel pour le SSR pur, mais recommandé pour l'hydratation
      scripts: ['https://cdn.nordcraft.io/runtime/v1/client.js'] 
    });
    
    // Retourne une réponse HTML avec le flux
    return c.html(htmlStream);
  } catch (error) {
    // Gestion d'erreur basique
    console.error('SSR Error:', error);
    return c.text(`Erreur lors du rendu : ${error.message}`, 500);
  }
});

// Export par défaut requis pour un Worker Cloudflare
export default {
  async fetch(request, env, ctx) {
    // Délègue toutes les requêtes à l'application Hono
    return app.fetch(request, env, ctx);
  },
};
