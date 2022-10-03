import { z } from "zod"

export const characterSchema = z.object({
  id: z.string(),
  name: z.string(),
  group: z.string(),
  concept: z.string(),
  appearance: z.string(),
  ties: z.string(),
  momentum: z.number(),
  stress: z.number(),
  condition: z.string(),
  actions: z.record(z.object({ level: z.number() })),
  talents: z.string(),
  hidden: z.boolean().optional(),
  color: z.string().optional(),
})
export type Character = z.output<typeof characterSchema>
