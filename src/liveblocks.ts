import type { LiveList } from "@liveblocks/client"
import { createClient } from "@liveblocks/client"
import { createRoomContext } from "@liveblocks/react"
import type { Character } from "./features/characters/character-sheet-data"
import type { ClockState } from "./features/clocks/clock-state"
import type { World } from "./features/world/world"

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
})

export const {
  suspense: {
    RoomProvider,
    useOthers,
    useUpdateMyPresence,
    useStorage,
    useMutation,
  },
} = createRoomContext<Presence, Storage>(liveblocksClient)
