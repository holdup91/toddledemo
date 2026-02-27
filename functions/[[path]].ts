import { Hono } from 'hono'
import { renderToReadableStream } from '@nordcraft/ssr'
import projectData from '../nordcraft-export-blue_dooku_main_takin-main.json'

const app = new Hono()

app.all('*', async (c) => {
  try {
    const htmlStream = await renderToReadableStream(projectData, {
      title: "Mon App Nordcraft",
      lang: "fr",
      scripts: ['https://cdn.nordcraft.io/runtime/v1/client.js']
    })
    return c.html(htmlStream)
  } catch (error: any) {
    return c.text(`Erreur : ${error.message}`, 500)
  }
})

export const onRequest = (context) => app.fetch(context.request, context.env)
