import { authorize } from "@liveblocks/node"
import type { ActionArgs } from "@remix-run/node"
import { env } from "~/env.server"
import { discordUserAllowList } from "../../features/auth/discord-allow-list"
import { getSession } from "../../features/auth/session"
import { getDiscordAuthUser } from "~/features/auth/discord"
import { defaultRoomId } from "~/features/multiplayer/liveblocks-client"

export async function action({ request }: ActionArgs) {
  const session = await getSession(request)

  const discordUser =
    session &&
    (await getDiscordAuthUser(session.discordAccessToken).catch((error) => {
      console.error("Failed to fetch Discord user:", error)
    }))

  const isAllowed = discordUser && discordUserAllowList.includes(discordUser.id)

  const authResponse = isAllowed
    ? await authorize({
        room: defaultRoomId,
        secret: env.LIVEBLOCKS_SECRET_KEY,
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
