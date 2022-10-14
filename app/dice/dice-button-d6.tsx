import { useStore } from "@nanostores/react"
import { useFetcher, useFetchers } from "@remix-run/react"
import clsx from "clsx"
import { AnimatePresence, motion } from "framer-motion"
import { Check, Dices, Minus, Plus, X } from "lucide-react"
import { atom } from "nanostores"
import { Button } from "~/ui/button"
import { blackCircleIconButtonClass, inputClass } from "~/ui/styles"

const countStore = atom(0)
const intentStore = atom("")

const diceButtonId = "dice-button"
const diceConfirmButtonId = "confirm-dice"
const intentInputId = "dice-intent"

let prev = countStore.get()
countStore.listen((next) => {
  if (prev === 0 && next > 0) {
    setTimeout(() => {
      // eslint-disable-next-line unicorn/prefer-query-selector
      document.getElementById(intentInputId)?.focus()
    })
  }

  if (prev > 0 && next === 0) {
    setTimeout(() => {
      // eslint-disable-next-line unicorn/prefer-query-selector
      document.getElementById(diceButtonId)?.focus()
    })
  }

  prev = next
})

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
        id={diceButtonId}
        type="submit"
        title="Roll some d6"
        className={blackCircleIconButtonClass}
        onClick={() => {
          countStore.set(countStore.get() + 1)
        }}
      >
        <Dices className={clsx(pending && "animate-spin")} />
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
            className="flex flex-wrap items-center justify-end gap-2"
            onSubmit={() => {
              countStore.set(0)
              intentStore.set("")
            }}
          >
            <input
              id={intentInputId}
              className={clsx(inputClass, "w-full max-w-xs")}
              title="Intent"
              name="intent"
              placeholder="Intent (notice, finesse, etc.)"
              maxLength={100}
              value={intent}
              onFocus={(event) => event.target.select()}
              onChange={(event) => {
                intentStore.set(event.target.value)
              }}
            />
            <input type="hidden" name="count" value={count} />
            <div className="flex items-center gap-2">
              <Button
                title="Cancel"
                className={blackCircleIconButtonClass}
                onClick={() => countStore.set(0)}
              >
                <X size={16} />
              </Button>
              <Button
                title="Subtract a dice"
                className={blackCircleIconButtonClass}
                onClick={() => countStore.set(countStore.get() - 1)}
              >
                <Minus size={16} />
              </Button>
              <Button
                title="Add a dice"
                className={blackCircleIconButtonClass}
                onClick={() => countStore.set(countStore.get() + 1)}
              >
                <Plus size={16} />
              </Button>
              <Button
                id={diceConfirmButtonId}
                type="submit"
                title="Roll"
                className={blackCircleIconButtonClass}
              >
                <Check size={16} />
              </Button>
            </div>
          </fetcher.Form>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
