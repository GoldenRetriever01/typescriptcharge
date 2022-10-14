import {
  useMutation,
  useStorage,
} from "~/multiplayer/liveblocks-react"
import { useLiveblocksStorageContext } from "~/multiplayer/liveblocks-storage"
import type { World } from "./world"

const defaultWorld = {
  name: "",
  description: "",
}

export function useWorld() {
  const storage = useLiveblocksStorageContext()
  return useStorage((root) => root.world) ?? storage.data.world
}

export function useUpdateWorld() {
  return useMutation((context, updates: Partial<World>) => {
    context.storage.set("world", {
      ...defaultWorld,
      ...context.storage.get("world"),
      ...updates,
    })
  }, [])
}
