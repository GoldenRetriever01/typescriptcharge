import { observable } from "@trpc/server/observable"
import { setTimeout } from "node:timers/promises"
import { z } from "zod"
import { Emitter } from "../../helpers/emitter"
import { prisma } from "../../prisma"
import { t } from "../../trpc/init"
import { defaultWorldId } from "../worlds/world-actions"
import { getClocks } from "./clock-actions"
import type { ClockState } from "./clock-state"
import { clockStateSchema } from "./clock-state"

type ClockListEvent = {
  clocks: ClockState[]
  userId?: string
}

const events = new Emitter<ClockListEvent>()

export const clockRouter = t.router({
  list: t.procedure.query(() => getClocks()),

  listUpdated: t.procedure.subscription(async () => {
    return observable<ClockListEvent>((emit) => events.subscribe(emit.next))
  }),

  setList: t.procedure
    .input(
      z.object({
        clocks: z.array(clockStateSchema),
        userId: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      await setTimeout(1000)
      await prisma.world.update({
        where: { id: defaultWorldId },
        data: { clocks: input.clocks },
      })

      events.emit(input)
    }),
})
