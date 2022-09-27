import { authorize } from "@liveblocks/node"
import type { ActionArgs } from "@remix-run/node"
import { env } from "~/env.server"
import { defaultRoomId } from "~/features/multiplayer/liveblocks-client"
import { getSessionUser } from "../../features/auth/session"

export async function action({ request }: ActionArgs) {
  const user = await getSessionUser(request)

  const authResponse = user?.isAllowed
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
