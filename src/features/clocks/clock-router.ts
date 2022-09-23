import { observable } from "@trpc/server/observable"
import { Emitter } from "../../helpers/emitter"
import { t } from "../../trpc/init"
import { getClocks } from "./clock-actions"
import type { ClockState } from "./clock-state"

type ClockListEvent = {
  clocks: ClockState[]
  userId?: string
}

const events = new Emitter<ClockListEvent>()

export const clockRouter = t.router({
  list: t.procedure.query(() => getClocks()),

  listUpdated: t.procedure.subscription(async () => {
    const clocks = await getClocks()
    return observable<ClockListEvent>((emit) => {
      emit.next({ clocks })
      return events.subscribe(emit.next)
    })
  }),
})
