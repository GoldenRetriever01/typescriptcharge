import { useStore } from "@nanostores/react"
import { useFetcher, useFetchers } from "@remix-run/react"
import clsx from "clsx"
import { AnimatePresence, motion } from "framer-motion"
import { atom } from "nanostores"
import { Check, Hexagon, Minus, X } from "react-feather"
import { Button } from "~/ui/button"
import { blackCircleIconButtonClass, inputClass } from "~/ui/styles"

const countStore = atom(0)
const intentStore = atom("")

export function setDiceRoll(count: number, intent: string) {
  countStore.set(count)
  intentStore.set(intent)
}

export function DiceButton() {
  const count = useStore(countStore)

  const fetchers = useFetchers()
  const pending = fetchers.some(
    (f) =>
      f.submission?.action === "/api/roll" && f.submission.method === "POST",
  )

  return (
    <div
      className={clsx("relative", count === 0 ? "opacity-75" : "opacity-100")}
    >
      <Button
        type="submit"
        title="Roll some d6"
        className={blackCircleIconButtonClass}
        disabled={pending}
        onClick={() => {
          countStore.set(countStore.get() + 1)
        }}
      >
        <Hexagon className={clsx(pending && "animate-spin")} />
      </Button>
      {count > 0 && (
        <span className="absolute top-0 right-0 block font-bold leading-none">
          {count}
        </span>
      )}
    </div>
  )
}

export function DiceConfirmPanel() {
  const count = useStore(countStore)
  const intent = useStore(intentStore)
  const fetcher = useFetcher()
  return (
    <AnimatePresence>
      {count > 0 && (
        <motion.div
          className="flex origin-bottom-right flex-col items-end gap-2"
          transition={{ type: "tween", duration: 0.15 }}
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
        >
          <fetcher.Form
            action="/api/roll"
            method="post"
            replace
            className="flex items-center gap-2"
          >
            <input
              className={clsx(inputClass, "w-64")}
              title="Intent"
              name="intent"
              placeholder="Intent (notice, finesse, etc.)"
              value={intent}
              onChange={(event) => {
                intentStore.set(event.target.value)
              }}
            />
            <input type="hidden" name="count" value={count} />
            <Button
              title="Cancel"
              className={blackCircleIconButtonClass}
              onClick={() => countStore.set(0)}
            >
              <X size={16} />
            </Button>
            <Button
              title="Minus 1"
              className={blackCircleIconButtonClass}
              onClick={() => countStore.set(countStore.get() - 1)}
            >
              <Minus size={16} />
            </Button>
            <Button
              type="submit"
              title="Roll"
              className={blackCircleIconButtonClass}
              onClick={() => countStore.set(0)}
            >
              <Check size={16} />
            </Button>
          </fetcher.Form>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
