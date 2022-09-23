import { LiveList } from "@liveblocks/client"
import { Plus } from "react-feather"
import { useMutation, useStorage } from "../../liveblocks"
import { solidButton } from "../../ui/styles"
import { Clock } from "./clock"
import type { ClockState } from "./clock-state"

export function ClockList() {
  const clocks = useStorage((root) => root.clocks)

  const setClocks = useMutation((context, clocks: ClockState[]) => {
    context.storage.set("clocks", new LiveList(clocks))
  }, [])

  return (
    <div className="grid gap-4">
      {clocks.length > 0 && (
        <div className="flex gap-4 flex-wrap justify-center ">
          {clocks.map((clock) => (
            <Clock
              key={clock.id}
              clock={clock}
              onChange={(clock) => {
                setClocks(clocks.map((c) => (c.id === clock.id ? clock : c)))
              }}
              onRemove={() => {
                setClocks(clocks.filter((c) => c.id !== clock.id))
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
