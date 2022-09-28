import { createClient } from "@supabase/supabase-js"
import type { Database } from "supabase/types"
import { env } from "./env.server"

export const supabase = createClient<Database>(
  env.SUPABASE_URL,
  env.SUPABASE_SERVICE_KEY,
)
