import { authorize } from "@liveblocks/node"
import type { ActionArgs } from "@remix-run/node"
import { env } from "~/env.server"
import { requireMembership } from "~/features/auth/require-membership"
import { requireSessionUser } from "~/features/auth/session"
import { defaultRoomId } from "~/features/multiplayer/liveblocks-client"
import { getDefaultWorld } from "~/features/world/world-db.server"

export async function action({ request }: ActionArgs) {
  const user = await requireSessionUser(request)
  const world = await getDefaultWorld()
  await requireMembership(user, world)

  const authResponse = await authorize({
    room: defaultRoomId,
    secret: env.LIVEBLOCKS_SECRET_KEY,
  })

  if (authResponse?.error) {
    console.error("Liveblocks auth error:", authResponse.error)
    return new Response(undefined, { status: 500 })
  }

  if (!authResponse) {
    return new Response(undefined, { status: 403 })
  }

  return new Response(authResponse.body, { status: authResponse.status })
}
