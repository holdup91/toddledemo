import { Hono } from 'hono';
// Chemin relatif pour remonter à la racine et entrer dans node_modules
// @ts-ignore
import { renderToReadableStream } from '../node_modules/@nordcraft/ssr/dist/index.js';
import projectData from '../nordcraft-export-blue.json';
const app = new Hono();

app.all('*', async (c) => {
  console.log('📥 Requête reçue:', c.req.url);
  
  try {
    console.log('📦 projectData chargé:', !!projectData);
    
    if (!projectData) {
      throw new Error('Fichier JSON manquant');
    }

    console.log('🚀 Tentative de rendu SSR...');
    const htmlStream = await renderToReadableStream(projectData, {
      title: 'Mon App Nordcraft',
      lang: 'fr',
      scripts: ['https://cdn.nordcraft.io/runtime/v1/client.js'],
      url: c.req.url,
      headers: Object.fromEntries(c.req.raw.headers),
    });
    
    console.log('✅ Rendu réussi');
    return new Response(htmlStream, {
      headers: { 'Content-Type': 'text/html; charset=UTF-8' },
    });
    
  } catch (error) {
    console.error('❌ ERREUR:', error);
    return new Response(`Erreur: ${error.message}`, { status: 500 });
  }
});

export default {
  async fetch(request: Request, env: unknown, ctx: ExecutionContext) {
    return app.fetch(request, env, ctx);
  },
};
