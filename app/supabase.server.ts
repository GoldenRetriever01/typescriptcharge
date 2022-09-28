import { createClient } from "@supabase/supabase-js"
import { env } from "./env.server"

// the supabase CLI doesn't work, so I'm handtyping types for now
export type SupabaseSchema = {
  public: {
    Tables: {
      "discord-users": {
        Row: {
          id: string
          discordId: string
          username: string
          avatar: string | null
          discriminator: string
        }
        Insert: {
          discordId: string
          username: string
          avatar: string | null
          discriminator: string
        }
        Update: {
          discordId?: string
          username?: string
          avatar?: string | null
          discriminator?: string
        }
      }
      "dice-logs": {
        Row: {
          id: string
          createdAt: string
          roomId: string
          userId: string
          dice: string
          intent: string
        }
        Insert: {
          roomId: string
          userId: string
          dice: string
          intent: string
        }
        Update: {
          roomId?: string
          userId?: string
          dice?: string
          intent?: string
        }
      }
    }
    Views: {}
    Functions: {}
  }
}

export const supabase = createClient<SupabaseSchema>(
  env.SUPABASE_URL,
  env.SUPABASE_SERVICE_KEY,
)
