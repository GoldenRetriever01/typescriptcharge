import { z } from "zod"

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production"])
    .optional()
    .default("development"),
  COOKIE_SECRET: z.string(),
  LIVEBLOCKS_SECRET_KEY: z.string(),
  DISCORD_CLIENT_ID: z.string(),
  DISCORD_CLIENT_SECRET: z.string(),
  DISCORD_REDIRECT_URI: z.string(),
  DISCORD_ALLOWLIST: z.string(),
  SUPABASE_URL: z.string(),
  SUPABASE_ANON_KEY: z.string(),
  SUPABASE_SERVICE_KEY: z.string(),
  ADMIN_DISCORD_ID: z.string(),
})

export const env = envSchema.parse(process.env)
