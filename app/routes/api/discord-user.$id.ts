import type { LoaderArgs } from "@remix-run/node"
import { json } from "@remix-run/node"
import { supabase } from "~/supabase.server"

export async function loader({ params }: LoaderArgs) {
  const result = await supabase
    .from("discord-users")
    .select("*")
    .eq("discordId", params.id)
    .single()

  return json({ user: result.data })
}
