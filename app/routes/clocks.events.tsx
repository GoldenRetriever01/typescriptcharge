import type { LoaderArgs } from "@remix-run/node"
import { clocksEmitter, getClocks } from "~/features/clocks/actions.server"
import type { ClockState } from "~/features/clocks/clock-state"
import { serverEvents } from "~/helpers/sse"

export async function loader({ request }: LoaderArgs) {
  const initialClocks = await getClocks()
  return serverEvents<ClockState[]>(request, (emit) => {
    emit(initialClocks)
    return clocksEmitter.subscribe(emit)
  })
}

export { loader as clocksSseLoader }
