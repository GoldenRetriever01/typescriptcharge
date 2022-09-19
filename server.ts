import { createExpressMiddleware } from "@trpc/server/adapters/express"
import { applyWSSHandler } from "@trpc/server/adapters/ws"
import chalk from "chalk"
import express from "express"
import { request } from "node:http"
import { join } from "node:path"
import { fileURLToPath } from "node:url"
import { dirname } from "node:path"
import { WebSocketServer } from "ws"
import { appRouter } from "./src/trpc/router"

const __dirname = dirname(fileURLToPath(import.meta.url))

const app = express()

app.use(
  "/api/http",
  createExpressMiddleware({ router: appRouter, createContext: () => ({}) }),
)

if (process.env.NODE_ENV === "production") {
  app.use(express.static(join(__dirname, "../client")))
} else {
  app.all("*", (req, res) => {
    request(new URL(req.url, `http://localhost:3000`), (proxyRes) => {
      res.writeHead(proxyRes.statusCode || 200, proxyRes.headers)
      proxyRes.pipe(res, { end: true })
    }).end()
  })
}

const port = process.env.PORT || 42_069

const httpServer = app.listen(port, () => {
  console.info(chalk.green(`🚀 http://localhost:${port}`))
})

const socketServer = new WebSocketServer({
  server: httpServer,
  path: "/api/socket",
})

applyWSSHandler({
  wss: socketServer,
  router: appRouter,
  createContext: () => ({}),
})
