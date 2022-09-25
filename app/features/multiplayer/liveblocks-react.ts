import { createRoomContext } from "@liveblocks/react"
import type {
  Presence,
  Storage,
} from "~/features/multiplayer/liveblocks-client"
import { createLiveblocksClient } from "~/features/multiplayer/liveblocks-client"

export const {
  suspense: {
    RoomProvider,
    useOthers,
    useUpdateMyPresence,
    useStorage,
    useMutation,
  },
} = createRoomContext<Presence, Storage>(createLiveblocksClient())
