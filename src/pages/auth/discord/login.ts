import type { APIRoute } from "astro"
import { getAuthorizeUrl } from "../../../helpers/discord"

export const get: APIRoute = () => {
  return new Response(undefined, {
    status: 302,
    headers: {
      Location: getAuthorizeUrl(),
    },
  })
}
