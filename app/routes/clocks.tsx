import { LiveList } from "@liveblocks/client"
import { useStore } from "@nanostores/react"
import { atom } from "nanostores"
import { Plus } from "react-feather"
import { Clock } from "~/features/clocks/clock"
import type { ClockState } from "~/features/clocks/clock-state"
import { syncStoreWithLiveblocks } from "~/features/multiplayer/liveblocks-client"
import { clearButtonClass } from "~/ui/styles"

const store = atom<ClockState[]>([])
syncStoreWithLiveblocks(
  store,
  (storage) => storage.root.get("clocks")?.toArray() ?? [],
  (storage, clocks) => {
    storage.root.set("clocks", new LiveList(clocks))
  },
)

const setClocks = (clocks: ClockState[]) => store.set(clocks)

export default function ClocksPage() {
  const clocks = useStore(store)

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
