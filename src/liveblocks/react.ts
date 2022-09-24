import { createRoomContext } from "@liveblocks/react"
import type { Presence, Storage } from "./client"
import { liveblocksClient } from "./client"

export const {
  suspense: {
    RoomProvider,
    useOthers,
    useUpdateMyPresence,
    useStorage,
    useMutation,
  },
} = createRoomContext<Presence, Storage>(liveblocksClient)
