import { redirect } from "@remix-run/node"
import { createLogoutCookie } from "~/features/auth/session"

export async function loader() {
  return redirect("/", {
    headers: { "Set-Cookie": await createLogoutCookie() },
  })
}
