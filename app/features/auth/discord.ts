import { env } from "~/env.server"

export function getAuthorizeUrl() {
  const url = new URL("https://discord.com/api/oauth2/authorize")
  url.searchParams.set("client_id", env.DISCORD_CLIENT_ID!)
  url.searchParams.set("redirect_uri", env.DISCORD_REDIRECT_URI!)
  url.searchParams.set("scope", "identify")
  url.searchParams.set("response_type", "code")
  return url.toString()
}

export async function discordLogin(authCode: string) {
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

export type DiscordUser = {
  id: string
  username: string
  avatar: string | null
  discriminator: string
  public_flags: number
}

export async function getDiscordAuthUser(
  accessToken: string,
): Promise<DiscordUser> {
  const response = await fetch("https://discord.com/api/oauth2/@me", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
  const data = await response.json()
  return data.user
}
