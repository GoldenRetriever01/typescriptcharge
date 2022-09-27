import { useFetcher } from "@remix-run/react"
import { Hexagon } from "react-feather"
import { Button } from "~/ui/button"
import { blackCircleIconButtonClass } from "~/ui/styles"

export function DiceRoller() {
  const fetcher = useFetcher()
  return (
    <fetcher.Form action="/api/roll" method="post">
      <Button
        type="submit"
        title="Roll dice"
        className={blackCircleIconButtonClass}
      >
        <Hexagon />
      </Button>
    </fetcher.Form>
  )
}
