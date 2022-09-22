import type { LoaderArgs } from "@remix-run/node"
import { clocksEmitter, getClocks } from "~/features/clocks/actions.server"
import { sse } from "~/helpers/sse"

export async function loader({ request }: LoaderArgs) {
  const initialClocks = await getClocks()
  return sse(request, (emit) => {
    emit(initialClocks)
    return clocksEmitter.subscribe(emit)
  })
}
