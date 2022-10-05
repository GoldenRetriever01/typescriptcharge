import clsx from "clsx"
import { AnimatePresence, motion } from "framer-motion"
import { List } from "lucide-react"
import { useState } from "react"
import { Virtuoso } from "react-virtuoso"
import { z } from "zod"
import { createContextWrapper } from "~/helpers/context"
import { useLocalStorage } from "~/helpers/local-storage"
import { Button } from "~/ui/button"
import { blackCircleIconButtonClass } from "~/ui/styles"
import type { DiceLogEntryProps } from "../dice/dice-log-entry"
import { DiceLogEntry } from "../dice/dice-log-entry"
import { defaultRoomId } from "./liveblocks-client"
import { usePusherEvent } from "./pusher-client"

const [useLogsPanelContext, LogsPanelProvider] = createContextWrapper(
  function useLogsPanelProvider() {
    const [visible, setVisible] = useLocalStorage({
      key: "logsPanelVisible",
      fallback: false,
      schema: z.boolean(),
    })

    const [realtimeLogs, setRealtimeLogs] = useState<DiceLogEntryProps[]>([])
    const [unread, setUnread] = useState(false)

    usePusherEvent(`new-dice-log:${defaultRoomId}`, (log) => {
      setRealtimeLogs((logs) => [...logs, log])
      if (!visible) setUnread(true)
    })

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

export function LogsPanel({ logs: logsProp }: { logs: DiceLogEntryProps[] }) {
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
                <DiceLogEntry {...log} />
              </div>
            )}
            className="thin-scrollbar -mr-1 h-full"
            followOutput={() => "smooth"}
            initialTopMostItemIndex={logs.length - 1}
            alignToBottom
            defaultItemHeight={120}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
