import { getAuthorizeUrl } from "~/features/auth/discord"

export function loader() {
  return new Response(undefined, {
    status: 302,
    headers: {
      Location: getAuthorizeUrl(),
    },
  })
}
