import { useStore } from "@nanostores/react"
import { Form } from "@remix-run/react"
import clsx from "clsx"
import { AnimatePresence, motion } from "framer-motion"
import { atom } from "nanostores"
import { Check, Hexagon, X } from "react-feather"
import { Button } from "~/ui/button"
import { blackCircleIconButtonClass, inputClass } from "~/ui/styles"

const countStore = atom(0)

export function DiceButton() {
  const count = useStore(countStore)
  return (
    <div
      className={clsx("relative", count === 0 ? "opacity-75" : "opacity-100")}
    >
      <Button
        type="submit"
        title="Roll some d6"
        className={blackCircleIconButtonClass}
        onClick={() => {
          countStore.set(countStore.get() + 1)
        }}
      >
        <Hexagon />
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
          <Form
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
            />
            <input type="hidden" name="count" value={count} />
            <Button
              title="Clear"
              className={blackCircleIconButtonClass}
              onClick={() => countStore.set(0)}
            >
              <X size={16} />
            </Button>
            <Button
              type="submit"
              title="Roll"
              className={blackCircleIconButtonClass}
              onClick={() => countStore.set(0)}
            >
              <Check size={16} />
            </Button>
          </Form>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
