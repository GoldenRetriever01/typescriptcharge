import type { LoaderArgs } from "@remix-run/node"
import { redirect } from "@remix-run/node"
import { createSessionCookie } from "../../../features/auth/session"
import { discordLogin } from "../../../helpers/discord"

export async function loader({ request }: LoaderArgs) {
  const url = new URL(request.url)
  const loginResponse = await discordLogin(url.searchParams.get("code")!)
  return redirect("/", {
    headers: {
      "Set-Cookie": await createSessionCookie(loginResponse),
    },
  })
}
