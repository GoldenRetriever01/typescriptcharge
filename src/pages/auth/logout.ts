import type { APIRoute } from "astro"
import { createLogoutCookie } from "../../session"

export const get: APIRoute = async () => {
  return new Response(undefined, {
    status: 302,
    headers: {
      "Location": "/",
      "Set-Cookie": createLogoutCookie(),
    },
  })
}
