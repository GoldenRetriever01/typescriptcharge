import { createClient, LiveList } from "@liveblocks/client"
import fetch from "cross-fetch"
import "dotenv/config"
import { readFile } from "node:fs/promises"
import { WebSocket } from "ws"

const file = process.argv[2]
// @ts-expect-error
const backupData = JSON.parse(await readFile(file, "utf8"))

// @ts-expect-error
const client = createClient({
  publicApiKey: process.env.LIVEBLOCKS_PUBLIC_KEY,
  fetchPolyfill: fetch,
  WebSocketPolyfill: WebSocket,
})

const room = client.enter("default", { initialPresence: {} })

const storage = await room.getStorage()
storage.root.update({
  world: backupData.data.world,
  clocks: new LiveList(backupData.data.clocks.data),
  characters: new LiveList(backupData.data.characters.data),
})

client.leave("default")
