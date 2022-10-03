import { createRoomContext } from "@liveblocks/react"
import type {
  Presence,
  Storage,
} from "~/features/multiplayer/liveblocks-client"
import { getLiveblocksClient } from "~/features/multiplayer/liveblocks-client"

export const {
  RoomProvider,
  useOthers,
  useUpdateMyPresence,
  useStorage,
  useMutation,
} = createRoomContext<Presence, Storage>(getLiveblocksClient())
