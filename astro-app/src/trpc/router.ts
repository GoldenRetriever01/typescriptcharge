import { clockRouter } from "../clocks/clock-router"
import { worldRouter } from "../worlds/world-router"
import { t } from "./init"

export const appRouter = t.mergeRouters(worldRouter, clockRouter)
export type AppRouter = typeof appRouter
