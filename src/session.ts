import type { CookieSerializeOptions } from "cookie"
import cookie from "cookie"
import cookieSignature from "cookie-signature"
import { z } from "zod"

const sessionSchema = z.object({
  discordAccessToken: z.string(),
})
type Session = z.infer<typeof sessionSchema>

const cookieOptions: CookieSerializeOptions = {
  httpOnly: true,
  secure: import.meta.env.PROD,
  sameSite: "lax",
  path: "/",
}

export function createSessionCookie(discordAuthResponse: {
  access_token: string
  expires_in: number
}) {
  const session: Session = {
    discordAccessToken: discordAuthResponse.access_token,
  }

  return cookie.serialize(
    "session",
    cookieSignature.sign(
      JSON.stringify(session),
      import.meta.env.COOKIE_SECRET!,
    ),
    { ...cookieOptions, maxAge: discordAuthResponse.expires_in },
  )
}

export function getSession(request: Request): Session | undefined {
  const cookies = cookie.parse(request.headers.get("cookie") || "")
  if (!cookies.session) return

  const session = cookieSignature.unsign(
    cookies.session,
    import.meta.env.COOKIE_SECRET!,
  )
  if (session === false) return

  const result = sessionSchema.safeParse(JSON.parse(session))
  if (!result.success) return

  return result.data
}
