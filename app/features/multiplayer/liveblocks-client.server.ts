import type { Client } from "@liveblocks/client"
import { createClient } from "@liveblocks/client"
import WebSocket from "isomorphic-ws"
import { env } from "~/env.server"
import {
  defaultRoomId,
  defaultRoomInit,
} from "~/features/multiplayer/liveblocks-client"

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
