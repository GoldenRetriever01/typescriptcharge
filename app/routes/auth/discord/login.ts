import { getAuthorizeUrl } from "../../../helpers/discord"

export function loader() {
  return new Response(undefined, {
    status: 302,
    headers: {
      Location: getAuthorizeUrl(),
    },
  })
}
