import { useEffect } from "react"
import { truthyJoin } from "~/helpers/truthy-join"
import { useWorld } from "./world-state"

export function WorldTitle() {
  const world = useWorld()
  useEffect(() => {
    document.title = truthyJoin(" | ", [world?.name, "Charge Worlds"])
  }, [world?.name])
  return <></>
}
