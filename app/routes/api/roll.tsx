import type { ActionArgs } from "@remix-run/node"
import { redirect } from "@remix-run/node"
import { getSessionUser } from "~/features/auth/session"
import { defaultRoomId } from "~/features/multiplayer/liveblocks-client"
import { supabase } from "~/supabase.server"

export function loader() {
  return redirect("/")
}

export async function action({ request }: ActionArgs) {
  const user = await getSessionUser(request)
  if (!user) {
    return new Response("Unauthorized", { status: 401 })
  }

  await supabase.from("dice-logs").insert({
    roomId: defaultRoomId,
    userId: user.id,
    dice: JSON.stringify([
      {
        sides: 6,
        result: Math.floor(Math.random() * 6) + 1,
      },
    ]),
  })

  return redirect(request.headers.get("Referer") ?? "/")
}
