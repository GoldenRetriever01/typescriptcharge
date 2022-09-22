import { Form } from "@remix-run/react"
import { Plus } from "react-feather"
import { solidButton } from "~/ui/styles"
import { Clock } from "./clock"
import type { ClockState } from "./clock-state"

export function ClockList({ clocks }: { clocks: ClockState[] }) {
  return (
    <div className="grid gap-4">
      {clocks.length > 0 && (
        <div className="flex gap-4 flex-wrap justify-center ">
          {clocks.map((clock) => (
            <Clock key={clock.id} clock={clock} />
          ))}
        </div>
      )}
      <Form method="post" action="/clocks" className="flex justify-center">
        <button type="submit" className={solidButton} onClick={() => {}}>
          <Plus />
          Add clock
        </button>
      </Form>
    </div>
  )
}
