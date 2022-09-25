import { env } from "~/env.server"

export let discordUserAllowList: string[] = []
try {
  discordUserAllowList = JSON.parse(env.DISCORD_ALLOWLIST)
} catch (error) {
  console.warn("Failed to parse DISCORD_ALLOWLIST", error)
  console.warn("Allowlist:", env.DISCORD_ALLOWLIST)
}
