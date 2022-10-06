import { z } from "zod"
import { env } from "~/env.server"

export function getAuthorizeUrl() {
  const url = new URL("https://discord.com/api/oauth2/authorize")
  url.searchParams.set("client_id", env.DISCORD_CLIENT_ID!)
  url.searchParams.set("redirect_uri", env.DISCORD_REDIRECT_URI!)
  url.searchParams.set("scope", "identify")
  url.searchParams.set("response_type", "code")
  return url.toString()
}

export type DiscordTokenResponse = {
  access_token: string
  expires_in: number
}

export async function discordLogin(
  authCode: string,
): Promise<DiscordTokenResponse> {
  const response = await fetch("https://discord.com/api/oauth2/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: env.DISCORD_CLIENT_ID!,
      client_secret: env.DISCORD_CLIENT_SECRET!,
      grant_type: "authorization_code",
      redirect_uri: env.DISCORD_REDIRECT_URI!,
      code: authCode,
    }),
  })
  return response.json()
}

const authResponseSchema = z.object({
  user: z.object({
    id: z.string(),
    username: z.string(),
    avatar: z.string().nullish(),
  }),
})

export type DiscordUser = z.infer<typeof authResponseSchema>["user"]

export async function getDiscordAuthUser(
  accessToken: string,
): Promise<DiscordUser> {
  const response = await fetch("https://discord.com/api/oauth2/@me", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
  console.info("Discord auth response:", {
    status: response.status,
    statusText: response.statusText,
  })

  const data = await response.json()
  console.info("Discord auth user:", data?.user)

  return authResponseSchema.parse(data).user
}
