import { useState } from "react"
import { Plus } from "react-feather"
import { TRPC, TrpcProvider } from "../trpc/react"
import { solidButton } from "../ui/styles"
import { Clock } from "./clock"
import type { ClockState } from "./clock-state"

type Props = {
  clocks: ClockState[]
}

export function ClockList(props: Props) {
  return (
    <TrpcProvider>
      <ClockListInternal {...props} />
    </TrpcProvider>
  )
}

function ClockListInternal(props: Props) {
  const [clocks, setClocks] = useState(props.clocks)
  TRPC.clocks.useSubscription(undefined, { onData: setClocks })

  const createClock = TRPC.createClock.useMutation()

  return (
    <div className="grid gap-4">
      {clocks.length > 0 && (
        <div className="flex gap-4 flex-wrap justify-center ">
          {clocks.map((clock) => (
            <Clock key={clock.id} clock={clock} />
          ))}
        </div>
      )}
      <div className="flex justify-center">
        <button
          type="button"
          className={solidButton}
          onClick={() => createClock.mutate()}
        >
          <Plus />
          Add clock
        </button>
      </div>
    </div>
  )
}
