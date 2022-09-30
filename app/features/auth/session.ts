import { createCookie } from "@remix-run/node"
import { z } from "zod"
import { env } from "~/env.server"
import { discordLogin } from "~/features/auth/discord"
import { discordUserAllowList } from "~/features/auth/discord-allow-list"
import { supabase } from "~/supabase.server"
import { getDiscordAuthUser } from "./discord"

const sessionSchema = z.object({
  userId: z.string(),
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

  const result = await supabase
    .from("discord-users")
    .upsert(
      {
        discordId: discordUser.id,
        username: discordUser.username,
        discriminator: discordUser.discriminator,
        avatar: `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}`,
      },
      { onConflict: "discordId" },
    )
    .select("*")
    .single()

  if (result.error) {
    console.error("Failed to upsert Discord user", result.error)
    return
  }

  const session: Session = {
    userId: result.data.discordId,
  }

  return sessionCookie.serialize(session, {
    maxAge: loginResponse.expires_in,
  })
}

export type SessionUser = {
  id: number
  discordId: string
  username: string
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

  const user = await supabase
    .from("discord-users")
    .select("*")
    .eq("discordId", result.data.userId)
    .single()

  if (user.error) {
    console.error("Failed to get user", user.error)
    return
  }

  return {
    ...user.data,
    isAllowed: discordUserAllowList.includes(user.data.discordId),
    isAdmin: env.ADMIN_DISCORD_ID === user.data.discordId,
  }
}

export function createLogoutCookie() {
  return sessionCookie.serialize("", { maxAge: 0 })
}
