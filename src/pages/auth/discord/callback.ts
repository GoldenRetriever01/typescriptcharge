import type { APIRoute } from "astro"
import { discordLogin } from "../../../discord"
import { createSessionCookie } from "../../../session"

export const get: APIRoute = async ({ request }) => {
  const url = new URL(request.url)
  const loginResponse = await discordLogin(url.searchParams.get("code")!)
  return new Response(undefined, {
    status: 302,
    headers: {
      "Location": "/",
      "Set-Cookie": createSessionCookie(loginResponse),
    },
  })
}
