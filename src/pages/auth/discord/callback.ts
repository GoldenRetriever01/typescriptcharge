import type { APIRoute } from "astro"
import { createSessionCookie } from "../../../session"

export const get: APIRoute = async ({ request }) => {
  const url = new URL(request.url)

  const response = await fetch("https://discord.com/api/oauth2/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: import.meta.env.DISCORD_CLIENT_ID!,
      client_secret: import.meta.env.DISCORD_CLIENT_SECRET!,
      grant_type: "authorization_code",
      redirect_uri: import.meta.env.DISCORD_REDIRECT_URI!,
      code: url.searchParams.get("code")!,
    }),
  })

  const data = await response.json()

  return new Response(undefined, {
    status: 302,
    headers: {
      "Location": "/",
      "Set-Cookie": createSessionCookie(data),
    },
  })
}
