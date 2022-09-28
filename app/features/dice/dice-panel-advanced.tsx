import {
  mdiDiceD10,
  mdiDiceD12,
  mdiDiceD20,
  mdiDiceD4,
  mdiDiceD6,
  mdiDiceD8,
} from "@mdi/js"
import { Icon as MaterialDesignIcon } from "@mdi/react"
import { useStore } from "@nanostores/react"
import { useFetcher } from "@remix-run/react"
import clsx from "clsx"
import { AnimatePresence, motion } from "framer-motion"
import { atom } from "nanostores"
import type { ReactNode } from "react"
import { Check, Hexagon, X } from "react-feather"
import { countWhere } from "~/helpers/count-where"
import { createLocalStorageToggleStore } from "~/helpers/local-storage"
import { Button } from "~/ui/button"
import { blackCircleIconButtonClass } from "~/ui/styles"

type DiceOption = {
  sides: number
  icon: ReactNode
}

const iconSize = 1.5

const diceOptions: DiceOption[] = [
  { sides: 4, icon: <MaterialDesignIcon size={iconSize} path={mdiDiceD4} /> },
  { sides: 6, icon: <MaterialDesignIcon size={iconSize} path={mdiDiceD6} /> },
  { sides: 8, icon: <MaterialDesignIcon size={iconSize} path={mdiDiceD8} /> },
  { sides: 10, icon: <MaterialDesignIcon size={iconSize} path={mdiDiceD10} /> },
  { sides: 12, icon: <MaterialDesignIcon size={iconSize} path={mdiDiceD12} /> },
  { sides: 20, icon: <MaterialDesignIcon size={iconSize} path={mdiDiceD20} /> },
]

const dicePanelVisibleStore = createLocalStorageToggleStore("dicePanelVisible")
const selectedDiceStore = atom<DiceOption[]>([])

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
  const selectedDice = useStore(selectedDiceStore)
  const fetcher = useFetcher()

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="flex origin-bottom-right flex-col items-end gap-2"
          transition={{ type: "tween", duration: 0.15 }}
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
        >
          {selectedDice.length > 0 && (
            <div className="flex gap-2">
              <button
                title="Clear"
                className={blackCircleIconButtonClass}
                onClick={() => selectedDiceStore.set([])}
              >
                <X size={16} />
              </button>
              <button
                title="Roll"
                className={blackCircleIconButtonClass}
                onClick={() => selectedDiceStore.set([])}
              >
                <Check size={16} />
              </button>
            </div>
          )}
          <div className="flex gap-2">
            {diceOptions.map((diceOption) => (
              <DiceOptionButton key={diceOption.sides} {...diceOption} />
            ))}
          </div>
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

function DiceOptionButton({ sides, icon }: DiceOption) {
  const selected = useStore(selectedDiceStore)
  const count = countWhere(selected, (d) => d.sides === sides)
  return (
    <div
      className={clsx("relative", count === 0 ? "opacity-75" : "opacity-100")}
    >
      <button
        className={blackCircleIconButtonClass}
        onClick={() => {
          selectedDiceStore.set([...selected, { sides, icon }])
        }}
      >
        {icon}
      </button>
      {count > 0 && (
        <span className="absolute top-0 right-0 block font-bold">{count}</span>
      )}
    </div>
  )
}
