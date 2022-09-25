import { z } from "zod"
import { env } from "~/env.server"
import { defaultRoomId } from "~/liveblocks/client"

const schema = z.object({
  data: z.object({
    world: z.object({
      name: z.string(),
      description: z.string(),
    }),
  }),
})

export async function getWorldData() {
  const response = await fetch(
    `https://api.liveblocks.io/v2/rooms/${defaultRoomId}/storage`,
    {
      headers: {
        Authorization: `Bearer ${env.LIVEBLOCKS_SECRET_KEY}`,
      },
    },
  )

  const data = await response.json()

  const result = schema.safeParse(data)
  if (!result.success) {
    console.warn("Failed to parse world data", result.error)
  } else {
    return result.data.data.world
  }
}
