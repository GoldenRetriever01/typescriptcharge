import { z } from "zod"

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .optional()
    .default("development"),

  DATABASE_URL: z.string(),
  COOKIE_SECRET: z.string(),

  LIVEBLOCKS_SECRET_KEY: z.string(),
  LIVEBLOCKS_PUBLIC_KEY: z.string(),

  DISCORD_CLIENT_ID: z.string(),
  DISCORD_CLIENT_SECRET: z.string(),
  DISCORD_REDIRECT_URI: z.string(),

  SUPABASE_URL: z.string(),
  SUPABASE_SERVICE_KEY: z.string(),

  PUSHER_APP_ID: z.string(),
  PUSHER_KEY: z.string(),
  PUSHER_SECRET: z.string(),
  PUSHER_CLUSTER: z.string(),
})

export const env = envSchema.parse(process.env)
