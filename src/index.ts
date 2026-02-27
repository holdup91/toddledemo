import { Hono } from 'hono';
import { renderToReadableStream } from '@nordcraft/ssr';
import projectData from '../nordcraft-export-blue.json';  // ← nom corrigé

const app = new Hono();

app.all('*', async (c) => {
  try {
    const htmlStream = await renderToReadableStream(projectData, {
      title: 'Mon App Nordcraft',
      lang: 'fr',
      scripts: ['https://cdn.nordcraft.io/runtime/v1/client.js'],
      url: c.req.url,
      headers: Object.fromEntries(c.req.raw.headers),
    });
    
    return new Response(htmlStream, {
      headers: { 'Content-Type': 'text/html; charset=UTF-8' },
    });
  } catch (error) {
    console.error('SSR Error:', error);
    return new Response(`Erreur : ${error.message}`, { status: 500 });
  }
});

export default {
  async fetch(request: Request, env: unknown, ctx: ExecutionContext) {
    return app.fetch(request, env, ctx);
  },
};
