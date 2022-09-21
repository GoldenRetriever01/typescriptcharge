import { Plus } from "preact-feather"
import { useState } from "preact/hooks"
import { solidButton } from "../ui/styles"
import { Clock } from "./clock"
import type { ClockState } from "./clock-state"

export function ClockList(props: { worldId: string; clocks: ClockState[] }) {
  const [clocks, setClocks] = useState(props.clocks)

  return (
    <div class="grid gap-4">
      {clocks.length > 0 && (
        <div class="flex gap-4 flex-wrap justify-center ">
          {clocks.map((clock) => (
            <Clock
              key={clock.id}
              clock={clock}
              onChange={(newClock) => {
                setClocks(
                  clocks.map((c) => (c.id === newClock.id ? newClock : c)),
                )
              }}
              onRemove={() => {
                setClocks(clocks.filter((c) => c.id !== clock.id))
              }}
            />
          ))}
        </div>
      )}
      <div class="flex justify-center">
        <button
          type="button"
          class={solidButton}
          onClick={() => {
            setClocks([
              ...clocks,
              {
                id: Math.random().toString(),
                name: "new clock",
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
