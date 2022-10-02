import { createCookie } from "@remix-run/node"
import cuid from "cuid"
import { z } from "zod"
import { env } from "~/env.server"
import { discordLogin } from "~/features/auth/discord"
import { discordUserAllowList } from "~/features/auth/discord-allow-list"
import { prisma } from "~/prisma.server"
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
})

export async function createSessionCookie(authCode: string) {
  const loginResponse = await discordLogin(authCode)
  const discordUser = await getDiscordAuthUser(loginResponse.access_token)

  const sessionId = cuid()

  await prisma.user.upsert({
    where: { discordId: discordUser.id },
    update: { sessionId },
    create: {
      discordId: discordUser.id,
      name: discordUser.username,
      avatar: discordUser.avatar
        ? `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.png`
        : undefined,
      sessionId,
    },
  })

  const session: Session = { sessionId }

  return sessionCookie.serialize(session, {
    maxAge: loginResponse.expires_in,
  })
}

export type SessionUser = {
  id: string
  name: string
  avatar: string | null
  isAllowed: boolean
  isAdmin: boolean
}

export async function getSessionUser(
  request: Request,
): Promise<SessionUser | undefined> {
  const session: unknown = await sessionCookie.parse(
    request.headers.get("cookie"),
  )
  if (!session) return

  const result = sessionSchema.safeParse(session)
  if (!result.success) {
    console.error("Failed to parse session", result.error)
    return
  }

  const userResult = await prisma.user.findFirst({
    where: { sessionId: result.data.sessionId },
    select: {
      id: true,
      name: true,
      avatar: true,
      discordId: true,
    },
  })
  if (!userResult) return

  const { discordId, ...user } = userResult
  return {
    ...user,
    isAllowed: discordUserAllowList.includes(discordId),
    isAdmin: env.ADMIN_DISCORD_ID === discordId,
  }
}

export function createLogoutCookie() {
  return sessionCookie.serialize("", { maxAge: 0 })
}
