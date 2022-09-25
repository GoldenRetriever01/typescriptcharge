import { useEffect } from "react"
import { truthyJoin } from "~/helpers/truthy-join"
import { useStorage } from "~/features/multiplayer/liveblocks-react"

export function WorldTitle() {
  const worldName = useStorage((root) => root.world?.name)
  useEffect(() => {
    document.title = truthyJoin(" | ", [worldName, "Charge Worlds"])
  }, [worldName])
  return <></>
}
