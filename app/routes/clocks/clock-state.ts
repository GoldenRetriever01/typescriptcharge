import { z } from "zod"

export const clockStateSchema = z.object({
  id: z.string(),
  name: z.string(),
  progress: z.number(),
  maxProgress: z.number(),
})
export type ClockState = z.infer<typeof clockStateSchema>
