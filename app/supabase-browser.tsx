import { createClient } from "@supabase/supabase-js"
import type { SupabaseSchema } from "./supabase.server"

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

export function createSupabaseBrowserClient() {
  if (!globalThis.__SUPABASE_CLIENT__) {
    throw new Error("Supabase client is not initialized")
  }
  return createClient<SupabaseSchema>(
    globalThis.__SUPABASE_CLIENT__.url,
    globalThis.__SUPABASE_CLIENT__.anonKey,
  )
}
