import { useStore } from "@nanostores/react"
import clsx from "clsx"
import { AnimatePresence, motion } from "framer-motion"
import { atom } from "nanostores"
import { List } from "react-feather"
import { Virtuoso } from "react-virtuoso"
import { createLocalStorageToggleStore } from "~/helpers/local-storage"
import { createSupabaseBrowserClient } from "~/supabase-browser"
import { Button } from "~/ui/button"
import { blackCircleIconButtonClass } from "~/ui/styles"
import type { DatabaseDiceLog } from "../dice/dice-data"
import { DiceLogEntry } from "../dice/dice-log-entry"

const logsPanelVisibleStore = createLocalStorageToggleStore("logsPanelVisible")
const realtimeLogsStore = atom<DatabaseDiceLog[]>([])
const unreadStore = atom(false)

if (typeof window !== "undefined") {
  const client = createSupabaseBrowserClient()

  client
    .channel("public:dice-logs")
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "dice-logs",
      },
      (payload: { new: DatabaseDiceLog }) => {
        realtimeLogsStore.set([...realtimeLogsStore.get(), payload.new])
        if (!logsPanelVisibleStore.get()) unreadStore.set(true)
      },
    )
    .subscribe()
}

export function useLogsPanelVisible() {
  return useStore(logsPanelVisibleStore)
}

export function LogsPanelButton() {
  const logsUnread = useStore(unreadStore)

  return (
    <Button
      type="button"
      title="View logs"
      onClick={() => {
        logsPanelVisibleStore.set(!logsPanelVisibleStore.get())
        unreadStore.set(false)
      }}
      className={clsx(
        blackCircleIconButtonClass,
        logsUnread && "animate-pulse text-blue-400",
      )}
    >
      <List />
    </Button>
  )
}

export function LogsPanel({ logs: logsProp }: { logs: DatabaseDiceLog[] }) {
  const realtimeLogs = useStore(realtimeLogsStore)
  const logs = [...logsProp, ...realtimeLogs]
  const visible = useStore(logsPanelVisibleStore)

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="h-full origin-bottom-right"
          transition={{ type: "tween", duration: 0.15 }}
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
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
        </motion.div>
      )}
    </AnimatePresence>
  )
}
