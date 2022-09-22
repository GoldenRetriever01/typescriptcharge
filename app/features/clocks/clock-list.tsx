import { useFetcher } from "@remix-run/react"
import { useState } from "react"
import { Plus } from "react-feather"
import { useEventSource } from "~/helpers/sse"
import type { clocksSseLoader } from "~/routes/clocks.events"
import { solidButton } from "~/ui/styles"
import { Clock } from "./clock"
import type { ClockState } from "./clock-state"

const authorId = typeof crypto !== "undefined" ? crypto.randomUUID() : "server"

export function ClockList(props: { clocks: ClockState[] }) {
  const [clocks, setClocks] = useState<ClockState[]>(props.clocks)

  useEventSource<typeof clocksSseLoader>("/clocks/events", (event) => {
    // don't update if we're the one who sent this event
    if (event.authorId === authorId) return

    setClocks(clocks)
  })

  const fetcher = useFetcher()

  const handleClocksUpdate = (clocks: ClockState[]) => {
    setClocks(clocks)
    fetcher.submit(
      { clocks: JSON.stringify(clocks), authorId },
      { method: "post", action: "/clocks/update", replace: true },
    )
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
