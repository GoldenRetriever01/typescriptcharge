import { createClient } from "@supabase/supabase-js"
import chalk from "chalk"
import fetch from "cross-fetch"
import { config } from "dotenv"
import cron from "node-cron"
import { existsSync } from "node:fs"

config({ path: ".env", override: true })
if (existsSync(".env.production")) {
  config({ path: ".env.production", override: true })
}

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

  const storage = await fetch(
    `https://api.liveblocks.io/v2/rooms/default/storage`,
    {
      headers: {
        Authorization: `Bearer ${process.env.LIVEBLOCKS_SECRET_KEY}`,
      },
    },
  ).then((res) => res.json())

  if (storage.error) {
    console.error(chalk.red("❌ Error fetching storage"))
    console.error(storage.error)
    return
  }

  console.info(chalk.dim("🚀 Uploading..."))

  const timestamp = new Date().toISOString().replace(/:/g, "-")
  const { error, data } = await supabase.storage
    .from("liveblocks-backup")
    .upload(`backup-${timestamp}.json`, JSON.stringify(storage))

  if (error) {
    console.error(chalk.red("❌ Supabase upload failed:"), error)
    return
  }

  console.info(chalk.green(`✅ Uploaded to ${data.path}`))
}
