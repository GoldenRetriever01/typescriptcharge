import type { SupabaseClient } from "@supabase/supabase-js"
import { createClient } from "@supabase/supabase-js"
import type { Database } from "supabase/types"

declare global {
  var __SUPABASE_CLIENT__: { url: string; anonKey: string } | undefined
}

export function SupabaseBrowserEnv({
  url,
  anonKey,
}: {
  url: string
  anonKey: string
}) {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `globalThis.__SUPABASE_CLIENT__ = ${JSON.stringify({
          url,
          anonKey,
        })}`,
      }}
    />
  )
}

let client: SupabaseClient<Database> | undefined
export function getSupabaseBrowserClient() {
  if (!globalThis.__SUPABASE_CLIENT__) {
    throw new Error(
      "Couldn't find supabase globals. Did you forget to add the SupabaseBrowserEnv component?",
    )
  }
  return (client ??= createClient(
    globalThis.__SUPABASE_CLIENT__.url,
    globalThis.__SUPABASE_CLIENT__.anonKey,
  ))
}
