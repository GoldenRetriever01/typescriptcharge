import { createCookie } from "@remix-run/node"
import { z } from "zod"
import { env } from "~/env.server"

const sessionSchema = z.object({
  discordAccessToken: z.string(),
})
export type Session = z.infer<typeof sessionSchema>

const sessionCookie = createCookie("session", {
  httpOnly: true,
  secure: env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
  secrets: [env.COOKIE_SECRET],
})

export function createSessionCookie(discordAuthResponse: {
  access_token: string
  expires_in: number
}) {
  const session: Session = {
    discordAccessToken: discordAuthResponse.access_token,
  }
  return sessionCookie.serialize(session, {
    maxAge: discordAuthResponse.expires_in,
  })
}

export async function getSession(
  request: Request,
): Promise<Session | undefined> {
  const session: unknown = await sessionCookie.parse(
    request.headers.get("cookie"),
  )
  const result = sessionSchema.safeParse(session)
  return result.success ? result.data : undefined
}

export function createLogoutCookie() {
  return sessionCookie.serialize("", { maxAge: 0 })
}
