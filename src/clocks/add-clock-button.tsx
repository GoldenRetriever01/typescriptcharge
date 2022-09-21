import { Plus } from "preact-feather"
import { solidButton } from "../ui/styles"

export function AddClockButton() {
  return (
    <button type="button" class={solidButton}>
      <Plus />
      Add clock
    </button>
  )
}
