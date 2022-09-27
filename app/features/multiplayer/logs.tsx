import { autoUpdate, offset, useFloating } from "@floating-ui/react-dom"
import type { SupabaseClient } from "@supabase/supabase-js"
import { useState } from "react"
import { List } from "react-feather"
import { z } from "zod"
import { useLocalStorage } from "~/helpers/use-local-storage"
import type { SupabaseSchema } from "~/supabase.server"
import { Button } from "~/ui/button"
import { blackCircleIconButtonClass } from "~/ui/styles"

const dieSchema = z.object({
  sides: z.number().int().positive(),
  result: z.number().int().positive(),
})
type Die = z.infer<typeof dieSchema>

const diceSchema = z.array(dieSchema)

function normalizedRollText(dice: Die[]) {
  const counts = new Map<number, number>()
  for (const die of dice) {
    counts.set(die.sides, (counts.get(die.sides) ?? 0) + 1)
  }
  return [...counts].map(([result, count]) => `${count}d${result}`).join(" + ")
}

function parseDiceJson(json: string) {
  try {
    return diceSchema.parse(JSON.parse(json))
  } catch (error) {
    console.warn("Failed to parse dice:", json, error)
  }
}

export function LogsButton({
  supabaseClient,
  initialLogs,
}: {
  supabaseClient: SupabaseClient<SupabaseSchema>
  initialLogs: Array<SupabaseSchema["public"]["Tables"]["dice-logs"]["Row"]>
}) {
  const [logs, setLogs] = useState(initialLogs)

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
        className={blackCircleIconButtonClass}
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
        {logs.map((log) => {
          const dice = parseDiceJson(log.dice)
          return (
            <li
              key={log.id}
              className="flex items-center gap-6 rounded-md bg-black/75 px-6 py-4 shadow-md"
            >
              <div className="flex flex-col gap-1">
                <p className="text-sm leading-none">
                  <span className="opacity-70">Rolled by</span>{" "}
                  {log.discordUserId}
                </p>

                {dice ? (
                  <>
                    <ul className="flex gap-1">
                      {dice.map((die, index) => (
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
                        {normalizedRollText(dice)}
                      </span>{" "}
                      = {dice.reduce((sum, die) => sum + die.result, 0)}
                    </p>
                  </>
                ) : (
                  <p className="text-sm leading-none text-red-400">
                    Failed to parse dice
                  </p>
                )}
              </div>
              {dice && (
                <>
                  <div className="-my-1 w-1 self-stretch rounded bg-white/25" />
                  <div className="flex flex-col items-center gap-0.5 text-center leading-none">
                    <p>
                      <span className="inline-block text-xs opacity-75">
                        Max
                      </span>
                      <br />
                      <span className="text-lg font-medium leading-tight">
                        {Math.max(...dice.map((die) => die.result))}
                      </span>
                    </p>
                    <p>
                      <span className="inline-block text-xs opacity-75">
                        Min
                      </span>
                      <br />
                      <span className="text-lg font-medium leading-tight">
                        {Math.min(...dice.map((die) => die.result))}
                      </span>
                    </p>
                  </div>
                </>
              )}
            </li>
          )
        })}
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
