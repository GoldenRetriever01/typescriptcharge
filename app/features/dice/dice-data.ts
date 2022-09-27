import type { SupabaseSchema } from "~/supabase.server"

export type DatabaseDiceLog =
  SupabaseSchema["public"]["Tables"]["dice-logs"]["Row"]
