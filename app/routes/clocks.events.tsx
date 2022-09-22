import type { LoaderArgs } from "@remix-run/node"
import { clockEvents, getClocks } from "~/features/clocks/actions.server"
import type { ClockEvent } from "~/features/clocks/clock-event"
import { getWorld } from "~/features/worlds/db.server"
import { serverEvents } from "~/helpers/sse"

export async function loader({ request }: LoaderArgs) {
  const clocks = await getClocks(await getWorld())
  return serverEvents<ClockEvent>(request, (emit) => {
    emit({ clocks })
    return clockEvents.subscribe(emit)
  })
}

export { loader as clocksSseLoader }
