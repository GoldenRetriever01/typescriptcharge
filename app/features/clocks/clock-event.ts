import { z } from "zod"
import { clockStateSchema } from "~/features/clocks/clock-state"

export const clockEventSchema = z.object({
  clocks: z.array(clockStateSchema),
  authorId: z.string().optional(),
})
export type ClockEvent = z.infer<typeof clockEventSchema>
