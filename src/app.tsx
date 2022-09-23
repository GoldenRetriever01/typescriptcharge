import { useState } from "react"
import type { ClockState } from "./features/clocks/clock-state"
import { proxyClient } from "./trpc/client"
import { trpc } from "./trpc/react"

const userId = crypto.randomUUID()

const initialClocks = await proxyClient.clocks.list.query()

export function App() {
  const [clocks, setClocks] = useState<ClockState[]>(initialClocks)

  trpc.clocks.listUpdated.useSubscription(undefined, {
    onData: (event) => {
      if (event.userId === userId) return
      setClocks(event.clocks)
    },
  })

  return (
    <div>
      <h1>ayy lmao</h1>
      <p>{JSON.stringify(clocks)}</p>
    </div>
  )
}
