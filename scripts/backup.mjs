import { createClient } from "@supabase/supabase-js"
import chalk from "chalk"
import fetch from "cross-fetch"
import "dotenv/config"
import cron from "node-cron"

const supabase = createClient(
  // @ts-expect-error
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY,
)

if (process.argv.includes("--now")) {
  await backup()
} else {
  console.info(chalk.dim("⚙ Starting backup cron job"))
  cron.schedule(`0 1 * * *`, backup)
}

async function backup() {
  console.info(chalk.dim("📥 Fetching storage..."))

  const data = await fetch(
    `https://api.liveblocks.io/v2/rooms/default/storage`,
    {
      headers: {
        Authorization: `Bearer ${process.env.LIVEBLOCKS_SECRET_KEY}`,
      },
    },
  ).then((res) => res.json())

  console.info(chalk.dim("🚀 Uploading..."))

  const { error } = await supabase.storage
    .from("liveblocks-backup")
    .upload(`backup-${Date.now()}.json`, JSON.stringify(data))

  if (error) {
    console.error(chalk.red("❌ Supabase upload failed:"), error)
  }
  console.info(chalk.green("✅ Done"))
}
