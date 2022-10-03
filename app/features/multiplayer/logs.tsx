import type { DiceLog } from "@prisma/client"
import clsx from "clsx"
import { AnimatePresence, motion } from "framer-motion"
import { List } from "lucide-react"
import { useEffect, useState } from "react"
import { Virtuoso } from "react-virtuoso"
import { z } from "zod"
import { createContextWrapper } from "~/helpers/context"
import { useLocalStorage } from "~/helpers/local-storage"
import { useLatestRef } from "~/helpers/react"
import { getSupabaseBrowserClient } from "~/supabase-browser"
import { Button } from "~/ui/button"
import { blackCircleIconButtonClass } from "~/ui/styles"
import { DiceLogEntry } from "../dice/dice-log-entry"
import { defaultRoomId } from "./liveblocks-client"

const [useLogsPanelContext, LogsPanelProvider] = createContextWrapper(
  function useLogsPanelProvider() {
    const [visible, setVisible] = useLocalStorage({
      key: "logsPanelVisible",
      fallback: false,
      schema: z.boolean(),
    })

    const [realtimeLogs, setRealtimeLogs] = useState<DiceLog[]>([])
    const [unread, setUnread] = useState(false)

    const visibleRef = useLatestRef(visible)

    useEffect(() => {
      const sub = getSupabaseBrowserClient()
        .channel("public:DiceLog")
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "DiceLog",
            filter: `roomId=eq.${defaultRoomId}`,
          },
          (payload: { new: DiceLog }) => {
            setRealtimeLogs((logs) => [...logs, payload.new])
            if (!visibleRef.current) setUnread(true)
          },
        )
        .subscribe()

      return () => void sub.unsubscribe()
    }, [visibleRef])

    return {
      realtimeLogs,
      visible,
      setVisible,
      unread,
      setUnread,
    }
  },
)
export { LogsPanelProvider }

export function LogsPanelButton() {
  const context = useLogsPanelContext()

  return (
    <Button
      type="button"
      title="View logs"
      onClick={() => {
        context.setVisible(!context.visible)
        context.setUnread(false)
      }}
      className={clsx(
        blackCircleIconButtonClass,
        context.unread && "animate-pulse text-blue-400",
      )}
    >
      <List />
    </Button>
  )
}

export function LogsPanel({ logs: logsProp }: { logs: DiceLog[] }) {
  const context = useLogsPanelContext()
  const logs = [...logsProp, ...context.realtimeLogs]

  return (
    <AnimatePresence>
      {context.visible && (
        <motion.div
          className="h-full"
          transition={{ type: "tween", duration: 0.15 }}
          initial={{ x: 16, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 16, opacity: 0 }}
        >
          <Virtuoso
            data={logs}
            itemContent={(index, log) => (
              <div className="pt-2">
                <DiceLogEntry log={log} />
              </div>
            )}
            className="thin-scrollbar -mr-1 h-full"
            followOutput={() => "auto"}
            initialTopMostItemIndex={logs.length - 1}
            alignToBottom
            defaultItemHeight={120}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
