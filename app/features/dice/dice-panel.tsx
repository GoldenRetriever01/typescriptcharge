import { useStore } from "@nanostores/react"
import { useFetcher } from "@remix-run/react"
import { AnimatePresence, motion } from "framer-motion"
import { Hexagon } from "react-feather"
import { createLocalStorageToggleStore } from "~/helpers/local-storage"
import { Button } from "~/ui/button"
import { blackCircleIconButtonClass } from "~/ui/styles"

const dicePanelVisibleStore = createLocalStorageToggleStore("dicePanelVisible")

export function DicePanelButton() {
  return (
    <Button
      type="submit"
      title="Show dice panel"
      className={blackCircleIconButtonClass}
      onClick={() => {
        dicePanelVisibleStore.set(!dicePanelVisibleStore.get())
      }}
    >
      <Hexagon />
    </Button>
  )
}

export function DicePanel() {
  const visible = useStore(dicePanelVisibleStore)
  const fetcher = useFetcher()

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="origin-bottom-right"
          transition={{ type: "tween", duration: 0.15 }}
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
        >
          <div className="rounded-md bg-black/75 p-4">the</div>
        </motion.div>
      )}
    </AnimatePresence>
  )

  // return (
  //   <fetcher.Form action="/api/roll" method="post">
  //     the
  //   </fetcher.Form>
  // )
}
