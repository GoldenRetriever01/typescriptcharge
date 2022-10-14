import { LiveList } from "@liveblocks/client"
import { Plus } from "lucide-react"
import { Clock } from "~/clocks/clock"
import type { ClockState } from "~/clocks/clock-state"
import {
  useMutation,
  useStorage,
} from "~/multiplayer/liveblocks-react"
import { useLiveblocksStorageContext } from "~/multiplayer/liveblocks-storage"
import { clearButtonClass, raisedPanelClass } from "~/ui/styles"

export default function ClocksPage() {
  const storage = useLiveblocksStorageContext()
  const clocks =
    useStorage((root) => root.clocks) ?? storage.data.clocks?.data ?? []

  const setClocks = useMutation((context, clocks: ClockState[]) => {
    context.storage.set("clocks", new LiveList(clocks))
  }, [])

  const updateClock = useMutation(
    (context, id: string, update: Partial<ClockState>) => {
      let clocks = context.storage.get("clocks")?.toArray() ?? []
      context.storage.set(
        "clocks",
        new LiveList(
          clocks.map((clock) =>
            clock.id === id ? { ...clock, ...update } : clock,
          ),
        ),
      )
    },
    [],
  )

  return (
    <div className={raisedPanelClass}>
      <div className="grid gap-4 p-4">
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
            className={clearButtonClass}
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
    </div>
  )
}
