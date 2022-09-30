import { useMutation, useStorage } from "../multiplayer/liveblocks-react"
import type { World } from "./world"

const defaultWorld = {
  name: "New World",
  description: "A brand new world",
}

export function useWorld() {
  return useStorage((root) => root.world)
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
