import { z } from "zod"
import { getWorld } from "../worlds/world-actions"
import { clockStateSchema } from "./clock-state"

export async function getClocks() {
  const world = await getWorld()
  const result = z.array(clockStateSchema).safeParse(world.clocks)
  if (result.success) return result.data

  console.warn("Invalid clocks", result.error, world.clocks)
  return []
}
