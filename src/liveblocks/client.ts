import { createClient, LiveList } from "@liveblocks/client"
import type { RoomInitializers } from "@liveblocks/client/internal"
import fetch from "cross-fetch"
import WebSocket from "isomorphic-ws"
import type { Character } from "../features/characters/character-sheet-data"
import type { ClockState } from "../features/clocks/clock-state"
import type { World } from "../features/world/world"

export type Presence = {
  cursor?: { name: string; x: number; y: number }
}

export type Storage = {
  world?: World
  clocks?: LiveList<ClockState>
  characters?: LiveList<Character>
}

export const liveblocksClient = createClient({
  publicApiKey: import.meta.env.PUBLIC_LIVEBLOCKS_KEY!,
  fetchPolyfill: fetch,
  WebSocketPolyfill: WebSocket,
})

export const defaultRoomId = import.meta.env.PROD ? "default" : "default-dev"

export const defaultRoomInit: RoomInitializers<Presence, Storage> = {
  initialPresence: {},
  initialStorage: {
    world: { name: "New World", description: "A brand new world" },
    clocks: new LiveList(),
    characters: new LiveList(),
  },
}
