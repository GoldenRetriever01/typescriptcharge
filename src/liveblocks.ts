import { createClient } from "@liveblocks/client"
import { createRoomContext } from "@liveblocks/react"

export type Presence = {
  cursor?: { x: number; y: number }
}

export const liveblocksClient = createClient({
  publicApiKey: "pk_live_OAgJktGmVcbhIXbgW8CNuS9Z",
})

export const {
  suspense: { RoomProvider, useOthers, useUpdateMyPresence },
} = createRoomContext<Presence>(liveblocksClient)
