import { Hono } from 'hono'
import { renderToReadableStream } from '@nordcraft/ssr'
// On remonte d'un dossier pour trouver le JSON à la racine
import projectData from '../nordcraft-export-blue_dooku_main_takin-main.json'

const app = new Hono()

app.get('*', async (c) => {
  try {
    const htmlStream = await renderToReadableStream(projectData, {
      title: "Mon App Nordcraft",
      lang: "fr",
      scripts: ['https://cdn.nordcraft.io/runtime/v1/client.js']
    })

    return c.html(htmlStream)
  } catch (error: any) {
    return c.text(`Erreur de rendu : ${error.message}`, 500)
  }
})

// Cette ligne permet à Cloudflare Pages de brancher votre app Hono
export const onRequest = (context) => app.fetch(context.request, context.env)
