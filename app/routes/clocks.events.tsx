import type { LoaderArgs } from "@remix-run/node"
import { z } from "zod"
import { clocksEmitter } from "~/features/clocks/actions.server"
import type { ClockState } from "~/features/clocks/clock-state"
import { clockStateSchema } from "~/features/clocks/clock-state"
import { getWorld } from "~/features/worlds/db.server"
import { serverEvents } from "~/helpers/sse"

export async function loader({ request }: LoaderArgs) {
  const world = await getWorld()
  return serverEvents<ClockState[]>(request, (emit) => {
    emit(z.array(clockStateSchema).parse(world.clocks))
    return clocksEmitter.subscribe(emit)
  })
}

export { loader as clocksSseLoader }
