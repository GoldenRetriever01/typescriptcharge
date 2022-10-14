import type { Client } from "@liveblocks/client"
import { createClient, LiveList } from "@liveblocks/client"
import type { RoomInitializers } from "@liveblocks/client/internal"
import { route } from "routes-gen"
import type { Character } from "~/characters/character-sheet-data"
import type { ClockState } from "~/clocks/clock-state"
import type { World } from "~/world/world"

export type Presence = {
  cursor?: { name: string; x: number; y: number; route: string }
}

export type Storage = {
  world?: World
  clocks?: LiveList<ClockState>
  characters?: LiveList<Character>
}

let client: Client
export function getLiveblocksClient() {
  return (client ??= createClient({
    authEndpoint: route("/auth/liveblocks"),
  }))
}

export function enterDefaultRoom() {
  return getLiveblocksClient().enter<Presence, Storage>(
    defaultRoomId,
    defaultRoomInit,
  )
}

export const defaultRoomId =
  process.env.NODE_ENV === "production" ? "default" : "default-dev"

export const defaultRoomInit: RoomInitializers<Presence, Storage> = {
  initialPresence: {},
  initialStorage: {
    world: { name: "New World", description: "A brand new world" },
    clocks: new LiveList(),
    characters: new LiveList(),
  },
}
