import type { Client } from "@liveblocks/client"
import { createClient } from "@liveblocks/client"
import fetch from "cross-fetch"
import WebSocket from "isomorphic-ws"
import { env } from "~/core/env.server"
import { defaultRoomId, defaultRoomInit } from "~/multiplayer/liveblocks-client"

declare global {
  var liveblocksClient: Client | undefined
}

export const serverLiveblocksClient = (globalThis.liveblocksClient ??=
  createClient({
    publicApiKey: env.LIVEBLOCKS_PUBLIC_KEY,
    fetchPolyfill: fetch,
    WebSocketPolyfill: WebSocket,
  }))

export const serverLiveblocksRoom = serverLiveblocksClient.enter(
  defaultRoomId,
  defaultRoomInit,
)
