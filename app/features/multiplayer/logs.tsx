import { autoUpdate, offset, size, useFloating } from "@floating-ui/react-dom"
import { useStore } from "@nanostores/react"
import type { SupabaseClient } from "@supabase/supabase-js"
import clsx from "clsx"
import { atom } from "nanostores"
import { useEffect, useState } from "react"
import { List } from "react-feather"
import { Virtuoso } from "react-virtuoso"
import { z } from "zod"
import { createLocalStorageStore } from "~/helpers/local-storage"
import type { SupabaseSchema } from "~/supabase.server"
import { Button } from "~/ui/button"
import { blackCircleIconButtonClass, slideRightTransition } from "~/ui/styles"
import type { DatabaseDiceLog } from "../dice/dice-data"
import { DiceLogEntry } from "../dice/dice-log-entry"

const logsVisibleStore = createLocalStorageStore({
  key: "logsVisible",
  fallback: false,
  schema: z.boolean(),
})

const logsUnreadStore = atom(false)

export function LogsPanelButton() {
  const logsUnread = useStore(logsUnreadStore)

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
    <Button
      type="button"
      title="View logs"
      onClick={() => {
        logsVisibleStore.set(!logsVisibleStore.get())
        logsUnreadStore.set(false)
      }}
      ref={floating.reference}
      className={clsx(
        blackCircleIconButtonClass,
        logsUnread && "animate-pulse text-blue-400",
      )}
    >
      <List />
    </Button>
  )
}

export function LogsPanel({
  supabaseClient,
  initialLogs,
}: {
  supabaseClient: SupabaseClient<SupabaseSchema>
  initialLogs: DatabaseDiceLog[]
}) {
  const [logs, setLogs] = useState(initialLogs)
  const visible = useStore(logsVisibleStore)

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
          setLogs((logs) => [...logs, payload.new])
          if (!logsVisibleStore.get()) logsUnreadStore.set(true)
        },
      )
      .subscribe()

    return () => {
      void sub.unsubscribe()
    }
  }, [supabaseClient])

  return (
    <div className={clsx("h-full", slideRightTransition(visible))}>
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
  )
}
