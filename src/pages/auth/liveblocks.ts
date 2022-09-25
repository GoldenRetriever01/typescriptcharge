import { authorize } from "@liveblocks/node"
import type { APIRoute } from "astro"
import { discordUserAllowList } from "../../features/auth/discord-allow-list"
import { getSession } from "../../features/auth/session"
import { getDiscordAuthUser } from "../../helpers/discord"
import { defaultRoomId } from "../../liveblocks/client"

export const post: APIRoute = async ({ request }) => {
  const session = getSession(request)

  const discordUser =
    session &&
    (await getDiscordAuthUser(session.discordAccessToken).catch((error) => {
      console.error("Failed to fetch Discord user:", error)
    }))

  const isAllowed = discordUser && discordUserAllowList.includes(discordUser.id)

  const authResponse = isAllowed
    ? await authorize({
        room: defaultRoomId,
        secret: import.meta.env.LIVEBLOCKS_SECRET_KEY,
      })
    : undefined

  if (authResponse?.error) {
    console.error("Liveblocks auth error:", authResponse.error)
    return new Response(undefined, { status: 500 })
  }

  if (!authResponse) {
    return new Response(undefined, { status: 403 })
  }

  return new Response(authResponse.body, { status: authResponse.status })
}
