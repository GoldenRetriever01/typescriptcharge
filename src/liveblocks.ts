import type { LiveList } from "@liveblocks/client"
import { createClient } from "@liveblocks/client"
import { createRoomContext } from "@liveblocks/react"
import type { Character } from "./features/characters/character-sheet-data"
import type { ClockState } from "./features/clocks/clock-state"

export type Presence = {
  cursor?: { x: number; y: number }
}

export type Storage = {
  world?: { name: string; description: string }
  clocks?: LiveList<ClockState>
  characters?: LiveList<Character>
}

export const liveblocksClient = createClient({
  publicApiKey: "pk_live_OAgJktGmVcbhIXbgW8CNuS9Z",
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
