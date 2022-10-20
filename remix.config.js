/* eslint-disable unicorn/prefer-module */
// @ts-expect-error
const { flatRoutes } = require("remix-flat-routes")

/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  serverBuildTarget: "vercel",
  server: process.env.NODE_ENV === "development" ? undefined : "./server.js",
  devServerPort: 8002,
  serverDependenciesToBundle: ["nanostores", "@nanostores/react"],
  ignoredRouteFiles: ["**/*"],
  routes: async (defineRoutes) => flatRoutes("routes", defineRoutes),
}
