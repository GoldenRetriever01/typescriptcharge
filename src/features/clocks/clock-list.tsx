import { useState } from "react"
import { Plus } from "react-feather"
import { proxyClient } from "../../trpc/client"
import { trpc } from "../../trpc/react"
import { solidButton } from "../../ui/styles"
import { Clock } from "./clock"
import type { ClockState } from "./clock-state"

const initialClocks = await proxyClient.clocks.list.query()
const userId = typeof crypto !== "undefined" ? crypto.randomUUID() : "server"

export function ClockList() {
  const [clocks, setClocks] = useState<ClockState[]>(initialClocks)
  const mutation = trpc.clocks.setList.useMutation()

  trpc.clocks.listUpdated.useSubscription(undefined, {
    onData: (event) => {
      if (event.userId === userId) return
      setClocks(event.clocks)
    },
  })

  const handleClocksUpdate = (clocks: ClockState[]) => {
    setClocks(clocks)
    mutation.mutate({ clocks, userId })
  }

  return (
    <div className="grid gap-4">
      {clocks.length > 0 && (
        <div className="flex gap-4 flex-wrap justify-center ">
          {clocks.map((clock) => (
            <Clock
              key={clock.id}
              clock={clock}
              onChange={(clock) => {
                handleClocksUpdate(
                  clocks.map((c) => (c.id === clock.id ? clock : c)),
                )
              }}
              onRemove={() => {
                handleClocksUpdate(clocks.filter((c) => c.id !== clock.id))
              }}
            />
          ))}
        </div>
      )}
      <div className="flex justify-center">
        <button
          type="button"
          className={solidButton}
          onClick={() => {
            handleClocksUpdate([
              ...clocks,
              {
                id: crypto.randomUUID(),
                name: "New Clock",
                progress: 0,
                maxProgress: 4,
              },
            ])
          }}
        >
          <Plus />
          Add clock
        </button>
      </div>
    </div>
  )
}
