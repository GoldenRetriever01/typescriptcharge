import { LiveList } from "@liveblocks/client"
import { Plus } from "react-feather"
import { useMutation, useStorage } from "~/features/multiplayer/liveblocks-react"
import { clearButtonClass } from "../../ui/styles"
import { Clock } from "./clock"
import type { ClockState } from "./clock-state"

export function ClockList() {
  const clocks = useStorage((root) => root.clocks) ?? []

  const setClocks = useMutation((context, clocks: ClockState[]) => {
    context.storage.set("clocks", new LiveList(clocks))
  }, [])

  const updateClock = (id: string, update: Partial<ClockState>) => {
    setClocks(
      clocks.map((clock) =>
        clock.id === id ? { ...clock, ...update } : clock,
      ),
    )
  }

  return (
    <div className="grid gap-4">
      {clocks.length > 0 && (
        <div className="flex flex-wrap justify-center gap-4 ">
          {clocks.map((clock) => (
            <Clock
              key={clock.id}
              {...clock}
              onNameChange={(name) => updateClock(clock.id, { name })}
              onProgressChange={(progress) =>
                updateClock(clock.id, { progress })
              }
              onMaxProgressChange={(maxProgress) =>
                updateClock(clock.id, { maxProgress })
              }
              onRemove={() =>
                setClocks(clocks.filter((c) => c.id !== clock.id))
              }
            />
          ))}
        </div>
      )}
      <div className="flex justify-center">
        <button
          type="button"
          className={clearButtonClass(false)}
          onClick={() => {
            setClocks([
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
