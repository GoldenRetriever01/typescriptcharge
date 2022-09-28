import type { Client, Json, LiveObject } from "@liveblocks/client"
import { createClient, LiveList } from "@liveblocks/client"
import type { RoomInitializers } from "@liveblocks/client/internal"
import type { WritableAtom } from "nanostores"
import type { Character } from "~/features/characters/character-sheet-data"
import type { ClockState } from "~/features/clocks/clock-state"
import type { World } from "~/features/world/world"

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
    authEndpoint: "/auth/liveblocks",
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

export function syncStoreWithLiveblocks<T extends Json>(
  store: WritableAtom<T>,
  init: (storage: { root: LiveObject<Storage> }) => T,
  save: (storage: { root: LiveObject<Storage> }, value: T) => void,
) {
  if (typeof window === "undefined") return

  const room = enterDefaultRoom()

  room
    .getStorage()
    .then((storage) => {
      store.set(init(storage))
    })
    .catch((error) => {
      console.warn("Failed to get characters from Liveblocks:", error)
    })

  store.subscribe(async (data) => {
    const storage = await room.getStorage()
    save(storage, data)
  })
}
