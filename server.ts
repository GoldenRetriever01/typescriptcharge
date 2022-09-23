import { createExpressMiddleware } from "@trpc/server/adapters/express"
import { applyWSSHandler } from "@trpc/server/adapters/ws"
import chalk from "chalk"
import compression from "compression"
import express from "express"
import morgan from "morgan"
import { WebSocketServer } from "ws"
import { appRouter } from "./src/trpc/app-router"

const isProd = process.env.NODE_ENV === "production"

const app = express()
app.disable("x-powered-by")
app.use(compression())
app.use("/api/http", createExpressMiddleware({ router: appRouter }))

if (isProd) {
  app.use(express.static("dist", { immutable: true, maxAge: "1y" }))
} else {
  const vite = await import("vite")
  const server = await vite.createServer({
    server: {
      middlewareMode: true,
    },
  })
  app.use(server.middlewares)
}

app.use(morgan("tiny"))

const port = process.env.PORT || 3000

const server = app.listen(port, () => {
  console.info(
    chalk.dim("server listening on"),
    chalk.bold(`http://localhost:${port}`),
  )
})

applyWSSHandler({
  router: appRouter,
  wss: new WebSocketServer({
    server,
    path: "/api/socket",
  }),
})
