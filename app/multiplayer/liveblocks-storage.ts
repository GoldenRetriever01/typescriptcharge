import { createContextWrapper } from "~/helpers/context"
import type { LiveblocksStorage } from "./liveblocks-storage.server"

export const [useLiveblocksStorageContext, LiveblocksStorageProvider] =
  createContextWrapper(({ storage }: { storage: LiveblocksStorage }) => storage)
