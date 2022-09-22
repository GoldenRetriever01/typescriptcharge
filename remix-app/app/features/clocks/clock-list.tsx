import { useFetcher, useTransition } from "@remix-run/react"
import { Plus } from "react-feather"
import type { clockActions } from "~/features/clocks/actions.server"
import { createCrudClient } from "~/helpers/crud"
import { solidButton } from "~/ui/styles"
import { Clock } from "./clock"
import type { ClockState } from "./clock-state"

const crud = createCrudClient<typeof clockActions>("/clocks")

export function ClockList(props: { clocks: ClockState[] }) {
  const transition = useTransition()
  const deletingClockId = crud.delete.getSubmissionInput(
    transition.submission,
  )?.id

  const clocks = props.clocks.filter((clock) => clock.id !== deletingClockId)

  const fetcher = useFetcher()

  return (
    <div className="grid gap-4">
      {clocks.length > 0 && (
        <div className="flex gap-4 flex-wrap justify-center ">
          {clocks.map((clock) => (
            <Clock key={clock.id} clock={clock} />
          ))}
        </div>
      )}
      <fetcher.Form
        method="post"
        action="/clocks"
        replace
        className="flex justify-center"
      >
        <button type="submit" className={solidButton}>
          <Plus />
          Add clock
        </button>
      </fetcher.Form>
    </div>
  )
}
