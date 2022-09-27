import { autoUpdate, offset, size, useFloating } from "@floating-ui/react-dom"
import { useStore } from "@nanostores/react"
import type { SupabaseClient } from "@supabase/supabase-js"
import clsx from "clsx"
import { useEffect, useState } from "react"
import { List } from "react-feather"
import { Virtuoso } from "react-virtuoso"
import { z } from "zod"
import { createLocalStorageStore } from "~/helpers/local-storage"
import { useEvent } from "~/helpers/react"
import type { SupabaseSchema } from "~/supabase.server"
import { Button } from "~/ui/button"
import { Portal } from "~/ui/portal"
import { blackCircleIconButtonClass } from "~/ui/styles"
import type { DatabaseDiceLog } from "../dice/dice-data"
import { DiceLogEntry } from "../dice/dice-log-entry"

const logsVisibleStore = createLocalStorageStore({
  key: "logsVisible",
  fallback: false,
  schema: z.boolean(),
})

export function LogsButton({
  supabaseClient,
  initialLogs,
}: {
  supabaseClient: SupabaseClient<SupabaseSchema>
  initialLogs: DatabaseDiceLog[]
}) {
  const [logs, setLogs] = useState(initialLogs)
  const [unread, setUnread] = useState(false)
  const visible = useStore(logsVisibleStore)

  const handleLogAdded = useEvent((log: DatabaseDiceLog) => {
    setLogs((logs) => [...logs, log])
    if (!visible) setUnread(true)
  })

  useEffect(() => {
    const sub = supabaseClient
      .channel("public:dice-logs")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "dice-logs",
        },
        (payload: { new: DatabaseDiceLog }) => {
          handleLogAdded(payload.new)
        },
      )
      .subscribe()

    return () => {
      void sub.unsubscribe()
    }
  }, [handleLogAdded, supabaseClient])

  const floating = useFloating({
    placement: "top-end",
    strategy: "fixed", // fixed positioning causes less shifting while scrolling
    middleware: [
      offset(8),
      size({
        padding: 16,
        apply: ({ elements, availableWidth, availableHeight }) => {
          elements.floating.style.height = `${availableHeight}px`
        },
      }),
    ],
    whileElementsMounted: autoUpdate,
  })

  return (
    <div>
      <Button
        type="button"
        title="View logs"
        onClick={() => {
          logsVisibleStore.set(!logsVisibleStore.get())
          setUnread(false)
        }}
        ref={floating.reference}
        className={clsx(
          blackCircleIconButtonClass,
          unread && "animate-pulse text-blue-400",
        )}
      >
        <List />
      </Button>
      <Portal>
        <div
          ref={floating.floating}
          className={clsx(
            "transition-all",
            visible
              ? "visible opacity-100"
              : "invisible translate-x-4 opacity-0",
          )}
          style={{
            position: floating.strategy,
            left: floating.x ?? 0,
            top: floating.y ?? 0,
          }}
        >
          <Virtuoso
            data={logs}
            itemContent={(index, log) => (
              <div className="flex justify-end pt-2">
                <DiceLogEntry log={log} />
              </div>
            )}
            className="overlay-scrollbar h-full w-96"
            followOutput="smooth"
            initialTopMostItemIndex={logs.length - 1}
            alignToBottom
          />
        </div>
      </Portal>
    </div>
  )
}
