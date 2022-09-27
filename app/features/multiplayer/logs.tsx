import { autoUpdate, offset, useFloating } from "@floating-ui/react-dom"
import clsx from "clsx"
import { List } from "react-feather"
import { z } from "zod"
import { useLocalStorage } from "~/helpers/use-local-storage"
import { Button } from "~/ui/button"
import { activePress } from "~/ui/styles"

type DiceRollLog = {
  id: string
  rolledBy: { id: string; name: string; avatarUrl?: string }
  dice: RolledDie[]
}

type RolledDie = {
  sides: number
  result: number
}

const logs: DiceRollLog[] = [
  {
    id: Math.random().toString(),
    rolledBy: { id: "1", name: "maple" },
    dice: [
      { sides: 6, result: 5 },
      { sides: 6, result: 2 },
      { sides: 6, result: 4 },
    ],
  },
  {
    id: Math.random().toString(),
    rolledBy: { id: "1", name: "emik" },
    dice: [
      { sides: 6, result: 1 },
      { sides: 6, result: 1 },
    ],
  },
  {
    id: Math.random().toString(),
    rolledBy: { id: "1", name: "craw" },
    dice: [{ sides: 6, result: 6 }],
  },
]

function normalizedRollText(dice: RolledDie[]) {
  const counts = new Map<number, number>()
  for (const die of dice) {
    counts.set(die.sides, (counts.get(die.sides) ?? 0) + 1)
  }
  return [...counts].map(([result, count]) => `${count}d${result}`).join(" + ")
}

export function LogsButton() {
  const [visible, setVisible] = useLocalStorage({
    key: "multiplayer-logs-visible",
    fallback: false,
    schema: z.boolean(),
  })

  const floating = useFloating({
    placement: "top-end",
    strategy: "fixed", // fixed positioning causes less shifting while scrolling
    middleware: [
      offset(8),
      // size({
      //   padding: 16,
      //   apply: ({ elements, availableWidth, availableHeight }) => {
      //     elements.floating.style.width = `${availableWidth}px`
      //     elements.floating.style.height = `${availableHeight}px`
      //   },
      // }),
    ],
    whileElementsMounted: autoUpdate,
  })

  return (
    <div>
      <Button
        type="button"
        title="View logs"
        onClick={() => setVisible(!visible)}
        ref={floating.reference}
        className={clsx(
          "rounded-full bg-black/25 p-3 transition hover:bg-black/50",
          activePress,
        )}
      >
        <List />
      </Button>
      <ul
        ref={floating.floating}
        className="flex flex-col items-end gap-2"
        style={{
          position: floating.strategy,
          left: floating.x ?? 0,
          top: floating.y ?? 0,
        }}
      >
        {logs.map((log) => (
          <li
            key={log.id}
            className="flex items-center gap-6 rounded-md bg-black/50 px-6 py-4 shadow-md"
          >
            <div className="flex flex-col gap-1">
              <p className="text-sm leading-none">
                <span className="opacity-70">Rolled by</span>{" "}
                {log.rolledBy.name}
              </p>
              <ul className="flex gap-1">
                {log.dice.map((die, index) => (
                  <li
                    key={index}
                    className="relative flex items-center justify-center"
                  >
                    <HexagonFilled className="h-8 w-8" />
                    <span className="absolute translate-y-[1px] font-medium text-gray-800">
                      {die.result}
                    </span>
                  </li>
                ))}
              </ul>
              <p className="text-sm">
                <span className="opacity-75">
                  {normalizedRollText(log.dice)}
                </span>{" "}
                = {log.dice.reduce((sum, die) => sum + die.result, 0)}
              </p>
            </div>
            <div className="-my-2 w-1 self-stretch rounded bg-white/25" />
            <div className="flex flex-col items-center gap-1 text-center leading-none">
              <p>
                <span className="mb-0.5 inline-block text-xs">Max</span>
                <br />
                <span className="font-medium">
                  {Math.max(...log.dice.map((die) => die.result))}
                </span>
              </p>
              <p>
                <span className="mb-0.5 inline-block text-xs">Min</span>
                <br />
                <span className="font-medium">
                  {Math.min(...log.dice.map((die) => die.result))}
                </span>
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

function HexagonFilled(props: React.SVGAttributes<SVGElement>) {
  return (
    <svg
      viewBox="0 0 28 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M12 1.1547C13.2376 0.440169 14.7624 0.440169 16 1.1547L25.8564 6.8453C27.094 7.55983 27.8564 8.88034 27.8564 10.3094V21.6906C27.8564 23.1197 27.094 24.4402 25.8564 25.1547L16 30.8453C14.7624 31.5598 13.2376 31.5598 12 30.8453L2.14359 25.1547C0.905989 24.4402 0.143594 23.1197 0.143594 21.6906V10.3094C0.143594 8.88034 0.905989 7.55983 2.14359 6.8453L12 1.1547Z"
        fill="currentColor"
      />
    </svg>
  )
}
