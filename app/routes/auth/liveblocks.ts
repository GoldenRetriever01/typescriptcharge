import { authorize } from "@liveblocks/node"
import type { ActionArgs } from "@remix-run/node"
import { env } from "~/env.server"
import { requireWorldMember } from "~/features/auth/require-world-member"
import { defaultRoomId } from "~/features/multiplayer/liveblocks-client"

export async function action({ request }: ActionArgs) {
  await requireWorldMember(request)

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
