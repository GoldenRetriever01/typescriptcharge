import { useStore } from "@nanostores/react"
import { computed } from "nanostores"
import { useEffect } from "react"
import { truthyJoin } from "~/helpers/truthy-join"
import { worldStore } from "./world-store"

const worldNameStore = computed(worldStore, (w) => w.name)

export function WorldTitle() {
  const worldName = useStore(worldNameStore)
  useEffect(() => {
    document.title = truthyJoin(" | ", [worldName, "Charge Worlds"])
  }, [worldName])
  return <></>
}
