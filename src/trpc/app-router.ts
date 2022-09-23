import { clockRouter } from "../features/clocks/clock-router"
import { worldRouter } from "../features/worlds/world-router"
import { t } from "./init"

export const appRouter = t.router({
  worlds: worldRouter,
  clocks: clockRouter,
})
