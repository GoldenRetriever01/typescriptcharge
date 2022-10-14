import { createRoomContext } from "@liveblocks/react"
import type { Presence, Storage } from "~/multiplayer/liveblocks-client"
import { getLiveblocksClient } from "~/multiplayer/liveblocks-client"

export const {
  RoomProvider,
  useOthers,
  useUpdateMyPresence,
  useStorage,
  useMutation,
} = createRoomContext<Presence, Storage>(getLiveblocksClient())
