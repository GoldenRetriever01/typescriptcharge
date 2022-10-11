import { getSessionUser } from "~/features/auth/session"
import { getDefaultWorld } from "~/features/world/world-db.server"

export async function requireWorldMember(request: Request) {
  const user = await getSessionUser(request)

  if (!user) {
    throw new Response(undefined, { status: 401 })
  }

  const world = await getDefaultWorld(user.discordId)
  const isAdmin = user.discordId === world.adminDiscordId
  const isPlayer = world.playerDiscordIds.includes(user.discordId)
  const isMember = isAdmin || isPlayer
  if (!isMember) {
    throw new Response(undefined, { status: 403 })
  }

  return user
}
