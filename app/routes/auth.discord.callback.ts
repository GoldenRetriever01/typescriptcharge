import type { LoaderArgs } from "@remix-run/node"
import { redirect } from "@remix-run/node"
import { createSessionCookie } from "~/auth/session"

export async function loader({ request }: LoaderArgs) {
  const url = new URL(request.url)
  const cookie = await createSessionCookie(url.searchParams.get("code")!)

  if (!cookie) {
    // TODO: render some error page
    return redirect("/")
  }

  return redirect("/", {
    headers: { "Set-Cookie": cookie },
  })
}
