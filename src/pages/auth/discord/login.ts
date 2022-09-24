import type { APIRoute } from "astro"

export const get: APIRoute = () => {
  const discordAuthUrl = new URL("https://discord.com/api/oauth2/authorize")
  discordAuthUrl.searchParams.set(
    "client_id",
    import.meta.env.DISCORD_CLIENT_ID!,
  )
  discordAuthUrl.searchParams.set(
    "redirect_uri",
    import.meta.env.DISCORD_REDIRECT_URI!,
  )
  discordAuthUrl.searchParams.set("scope", "identify")
  discordAuthUrl.searchParams.set("response_type", "code")

  return new Response(undefined, {
    status: 302,
    headers: {
      Location: discordAuthUrl.toString(),
    },
  })
}
