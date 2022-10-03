import { z } from "zod"
import { env } from "~/env.server"
import { defaultRoomId } from "~/features/multiplayer/liveblocks-client"
import { characterSchema } from "../characters/character-sheet-data"
import { clockStateSchema } from "../clocks/clock-state"

const liveblocksStorageSchema = z.object({
  data: z
    .object({
      world: z.object({
        name: z.string(),
        description: z.string(),
      }),
      clocks: z.object({
        data: z.array(clockStateSchema),
      }),
      characters: z.object({
        data: z.array(characterSchema),
      }),
    })
    .partial(),
})
export type LiveblocksStorage = z.output<typeof liveblocksStorageSchema>

export async function getLiveblocksStorage() {
  const response = await fetch(
    `https://api.liveblocks.io/v2/rooms/${defaultRoomId}/storage`,
    {
      headers: {
        Authorization: `Bearer ${env.LIVEBLOCKS_SECRET_KEY}`,
      },
    },
  )
  return liveblocksStorageSchema.parse(await response.json())
}
