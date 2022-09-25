export let discordUserAllowList: string[] = []
try {
  discordUserAllowList = JSON.parse(import.meta.env.DISCORD_ALLOWLIST)
} catch (error) {
  console.warn("Failed to parse DISCORD_ALLOWLIST", error)
  console.warn("Allowlist:", import.meta.env.DISCORD_ALLOWLIST)
}
