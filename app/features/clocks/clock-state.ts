import { z } from "zod"
import { parseUnsignedInt } from "~/helpers/parse"

export type ClockState = {
  id: string
  name: string
  progress: number
  maxProgress: number
}

export const clockUpdateSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  progress: z.string().transform(parseUnsignedInt).optional(),
  maxProgress: z.string().transform(parseUnsignedInt).optional(),
})
