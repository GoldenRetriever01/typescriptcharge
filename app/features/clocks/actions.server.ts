import type { World } from "@prisma/client"
import { z } from "zod"
import { Emitter } from "~/helpers/emitter"
import type { ClockState } from "./clock-state"
import { clockStateSchema } from "./clock-state"

declare global {
  var clocksEmitter: Emitter<ClockState[]> | undefined
}

export const clocksEmitter = (globalThis.clocksEmitter ??= new Emitter<
  ClockState[]
>())

export async function getClocks(world: World): Promise<ClockState[]> {
  const result = z.array(clockStateSchema).safeParse(world.clocks)
  if (result.success) return result.data

  console.warn("Invalid clocks:", result.error, world.clocks)
  return []
}
