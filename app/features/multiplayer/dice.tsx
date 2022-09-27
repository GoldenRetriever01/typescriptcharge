import { Hexagon } from "react-feather"
import { Button } from "~/ui/button"
import { blackCircleIconButtonClass } from "~/ui/styles"

export function DiceButton() {
  return (
    <Button title="Show dice" className={blackCircleIconButtonClass}>
      <Hexagon />
    </Button>
  )
}
