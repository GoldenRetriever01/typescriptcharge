import { useStore } from "@nanostores/react"
import { atom, computed } from "nanostores"
import { Cloud, CloudOff } from "react-feather"
import { Button } from "~/ui/button"
import { blackCircleIconButtonClass } from "~/ui/styles"

const toggleStore = atom(false)

export const liveblocksEnabledStore = computed(toggleStore, (enabled) => {
  if (typeof window === "undefined") return false
  if (process.env.NODE_ENV === "production") return true
  return enabled
})

export function isLiveblocksEnabled() {
  return liveblocksEnabledStore.get()
}

export function useLiveblocksEnabled() {
  return useStore(liveblocksEnabledStore)
}

export function LiveblocksConnectionToggle() {
  const isEnabled = useLiveblocksEnabled()
  return (
    <Button
      title="Toggle connection to Liveblocks"
      className={blackCircleIconButtonClass}
      onClick={() => toggleStore.set(!toggleStore.get())}
    >
      {isEnabled ? <Cloud /> : <CloudOff />}
    </Button>
  )
}
