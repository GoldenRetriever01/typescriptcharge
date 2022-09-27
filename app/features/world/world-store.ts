import { atom } from "nanostores"
import { syncStoreWithLiveblocks } from "~/features/multiplayer/liveblocks-client"
import type { World } from "~/features/world/world"

const defaultWorld = {
  name: "New World",
  description: "A brand new world",
}

export const worldStore = atom<{
  name: string
  description: string
}>(defaultWorld)
syncStoreWithLiveblocks(
  worldStore,
  (storage) => storage.root.get("world") ?? defaultWorld,
  (storage, world) => {
    storage.root.set("world", world)
  },
)

export const updateWorld = (world: Partial<World>) => {
  worldStore.set({ ...worldStore.get(), ...world })
}
