import { z } from "zod"

import { Suspense } from "react"

export type DiceLogEntryProps = {
  user: { name: string }
  dice: unknown[]
  intent: string
}

export function DiceLogEntry(props: DiceLogEntryProps): JSX.Element {
  const dice = parseDiceJson(props.dice)
  return (
    <div className="flex items-end gap-6 rounded-md bg-black/75 px-6 py-4">
      <div className="flex flex-1 flex-col gap-1">
        {dice ? (
          <>
            {!!props.intent && <p className="leading-tight">{props.intent}</p>}

            <ul className="flex flex-wrap gap-1">
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
          </>
        ) : (
          <p className="text-sm leading-none text-red-400">
            Failed to parse dice: {JSON.stringify(props.dice)}
          </p>
        )}

        <Suspense>
          <p className="mt-auto text-[13px]">
            <span className="opacity-70">Rolled by</span> {props.user.name}
          </p>
        </Suspense>
      </div>
      {dice && (
        <>
          <div className="-my-1 w-1 self-stretch rounded bg-white/25" />

          <div className="flex flex-col items-center gap-0.5 self-center text-center leading-none">
            <p>
              <span className="inline-block text-xs opacity-75">Max</span>
              <br />
              <span className="text-lg font-medium leading-tight">
                {Math.max(...dice.map((die) => die.result))}
              </span>
            </p>
            <p>
              <span className="inline-block text-xs opacity-75">Min</span>
              <br />
              <span className="text-lg font-medium leading-tight">
                {Math.min(...dice.map((die) => die.result))}
              </span>
            </p>
          </div>
        </>
      )}
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

const diceSchema = z.array(
  z.object({
    sides: z.number().int().positive(),
    result: z.number().int().positive(),
  }),
)

function parseDiceJson(input: unknown) {
  try {
    return diceSchema.parse(
      typeof input === "string" ? JSON.parse(input) : input,
    )
  } catch (error) {
    console.warn("Failed to parse dice:", input, error)
  }
}
