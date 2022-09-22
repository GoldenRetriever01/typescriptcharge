import { Form, useTransition } from "@remix-run/react"
import { Plus } from "react-feather"
import type { clockActions } from "~/features/clocks/actions.server"
import { createCrudClient } from "~/helpers/crud"
import { solidButton } from "~/ui/styles"
import { Clock } from "./clock"
import type { ClockState } from "./clock-state"

const crud = createCrudClient<typeof clockActions>("/clocks")

export function ClockList(props: { clocks: ClockState[] }) {
  const transition = useTransition()

  const creatingClock = crud.post.getSubmissionInput(transition)
  const deletingClockId = crud.delete.getSubmissionInput(transition)?.id

  let clocks = props.clocks.filter((clock) => clock.id !== deletingClockId)
  if (creatingClock) {
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
