import { getDiscordAuthUser } from "~/features/auth/discord"
import { discordUserAllowList } from "~/features/auth/discord-allow-list"
import { getSession } from "~/features/auth/session"
import { supabase } from "~/supabase.server"

export async function loadAuth(request: Request) {
  const session = await getSession(request)

  const discordUser =
    session &&
    (await getDiscordAuthUser(session.discordAccessToken).catch((error) => {
      console.warn("Failed to fetch Discord user", error)
    }))

  if (discordUser) {
    const response = await supabase.from("discord-users").upsert(
      {
        discordId: discordUser.id,
        username: discordUser.username,
        discriminator: discordUser.discriminator,
        avatar: discordUser.avatar,
      },
      { onConflict: "discordId" },
    )
    if (response.error) {
      console.error("Failed to upsert Discord user", response.error)
    }
  }

  const isAllowed = discordUser && discordUserAllowList.includes(discordUser.id)

  return { discordUser, isAllowed }
}
