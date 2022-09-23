import { t } from "../../trpc/init"
import { getWorld } from "./world-actions"

export const worldRouter = t.router({
  default: t.procedure.query(() => getWorld()),
})
