import type { ActionArgs } from "@remix-run/node"
import { redirect } from "@remix-run/node"
import { loadAuth } from "~/features/auth/load-auth"
import { defaultRoomId } from "~/features/multiplayer/liveblocks-client"
import { supabase } from "~/supabase.server"

export function loader() {
  return redirect("/")
}

export async function action({ request }: ActionArgs) {
  const { discordUser, isAllowed } = await loadAuth(request)
  if (!discordUser) {
    return new Response("Unauthorized", { status: 401 })
  }

  if (!isAllowed) {
    return new Response("Forbidden", { status: 403 })
  }

  await supabase.from("dice-logs").insert({
    roomId: defaultRoomId,
    discordUserId: discordUser.id,
    dice: JSON.stringify([
      {
        sides: 6,
        result: Math.floor(Math.random() * 6) + 1,
      },
    ]),
  })

  return redirect(request.headers.get("Referer") ?? "/")
}
