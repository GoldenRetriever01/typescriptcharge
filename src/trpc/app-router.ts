import { clockRouter } from "../features/clocks/clock-router"
import { t } from "./init"

export const appRouter = t.router({
  clocks: clockRouter,
})
