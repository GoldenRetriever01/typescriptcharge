import { createClient } from "@supabase/supabase-js"
import fetch from "cross-fetch"
import cron from "node-cron"

const supabase = createClient(
  // @ts-expect-error
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY,
)

console.info("Starting backup cron job")

cron.schedule(`0 1 * * *`, async () => {
  console.info("Running backup...")

  const data = await fetch(
    `https://api.liveblocks.io/v2/rooms/default/storage`,
    {
      headers: {
        Authorization: `Bearer ${process.env.LIVEBLOCKS_SECRET_KEY}`,
      },
    },
  ).then((res) => res.json())

  const { error } = await supabase.storage
    .from("liveblocks-backup")
    .upload(`backup-${Date.now()}.json`, JSON.stringify(data))

  if (error) {
    console.error("Supabase upload failed:", error)
  }
  console.info("Done")
})
