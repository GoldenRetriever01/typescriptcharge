import { z } from "zod"
import type { DatabaseDiceLog } from "./dice-data"

import { Suspense } from "react"
import { createFetchStore } from "react-suspense-fetch"
import type { DiscordUser } from "../auth/discord"

export function DiceLogEntry({ log }: { log: DatabaseDiceLog }): JSX.Element {
  const dice = parseDiceJson(log.dice)
  return (
    <div className="flex items-center gap-6 rounded-md bg-black/75 px-6 py-4">
      <div className="flex flex-col gap-1">
        <Suspense>
          <p className="text-sm leading-none">
            <span className="opacity-70">Rolled by</span>{" "}
            <DiscordUsername id={log.discordUserId} />
          </p>
        </Suspense>

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
              <span className="opacity-75">{normalizedRollText(dice)}</span> ={" "}
              {dice.reduce((sum, die) => sum + die.result, 0)}
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

const usernameStore = createFetchStore(async (discordUserId: string) => {
  const res = await fetch(`/api/discord-user/${discordUserId}`)
  const data = (await res.json()) as { user?: DiscordUser }
  return data.user
})

function DiscordUsername({ id }: { id: string }) {
  const user = usernameStore.get(id, { forcePrefetch: true })
  return <>{user?.username ?? "unknown"}</>
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

const dieSchema = z.object({
  sides: z.number().int().positive(),
  result: z.number().int().positive(),
})
export type Die = z.infer<typeof dieSchema>

const diceSchema = z.array(dieSchema)

function normalizedRollText(dice: Die[]) {
  const counts = new Map<number, number>()
  for (const die of dice) {
    counts.set(die.sides, (counts.get(die.sides) ?? 0) + 1)
  }
  return [...counts].map(([result, count]) => `${count}d${result}`).join(" + ")
}

function parseDiceJson(input: unknown) {
  try {
    return diceSchema.parse(
      typeof input === "string" ? JSON.parse(input) : input,
    )
  } catch (error) {
    console.warn("Failed to parse dice:", input, error)
  }
}
