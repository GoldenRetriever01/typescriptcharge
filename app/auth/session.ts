import type { User } from "@prisma/client"
import { createCookie } from "@remix-run/node"
import cuid from "cuid"
import { z } from "zod"
import { discordLogin } from "~/auth/discord"
import { db } from "~/core/db.server"
import { env } from "~/core/env.server"
import { raise } from "~/helpers/errors"
import { getDiscordAuthUser } from "./discord"

const sessionSchema = z.object({
  sessionId: z.string(),
})
export type Session = z.infer<typeof sessionSchema>

const sessionCookie = createCookie("session", {
  httpOnly: true,
  secure: env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
  secrets: [env.COOKIE_SECRET],
  maxAge: 60 * 60 * 24 * 365, // 1 year
})

export async function createSessionCookie(authCode: string) {
  const loginResponse = await discordLogin(authCode)
  const discordUser = await getDiscordAuthUser(loginResponse.access_token)

  const sessionId = cuid()

  const data = {
    name: discordUser.username,
    avatar: discordUser.avatar
      ? `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.png`
      : undefined,
    sessionId,
  }

  await db.user.upsert({
    where: { discordId: discordUser.id },
    update: data,
    create: { ...data, discordId: discordUser.id },
  })

  const session: Session = { sessionId }
  return sessionCookie.serialize(session)
}

export function createLogoutCookie() {
  return sessionCookie.serialize("", { maxAge: 0 })
}

export async function getSessionUser(
  request: Request,
): Promise<User | undefined> {
  const session: unknown = await sessionCookie.parse(
    request.headers.get("cookie"),
  )
  if (!session) return

  const result = sessionSchema.safeParse(session)
  if (!result.success) {
    console.error("Failed to parse session", result.error)
    return
  }

  const user = await db.user.findFirst({
    where: { sessionId: result.data.sessionId },
  })
  return user ?? undefined
}

export async function requireSessionUser(request: Request) {
  const user = await getSessionUser(request)
  return user ?? raise(new Response(undefined, { status: 401 }))
}
