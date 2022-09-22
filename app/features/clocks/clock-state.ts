import { z } from "zod"

export type ClockState = z.infer<typeof clockStateSchema>

export const clockStateSchema = z.object({
  id: z.string(),
  name: z.string(),
  progress: z.number(),
  maxProgress: z.number(),
})
