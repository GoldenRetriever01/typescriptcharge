import { Form, useTransition } from "@remix-run/react"
import { Plus } from "react-feather"
import { solidButton } from "~/ui/styles"
import { Clock } from "./clock"
import type { ClockState } from "./clock-state"

export function ClockList(props: { clocks: ClockState[] }) {
  const transition = useTransition()

  const deletedClockId =
    transition.submission?.action === "/clocks" &&
    transition.submission?.method === "DELETE" &&
    transition.submission.formData.get("id")

  let clocks = props.clocks.filter((clock) => clock.id !== deletedClockId)

  if (
    transition.submission?.action === "/clocks" &&
    transition.submission?.method === "POST"
  ) {
    clocks = [
      ...clocks,
      { id: "placeholder", name: "New Clock", progress: 0, maxProgress: 4 },
    ]
  }

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
