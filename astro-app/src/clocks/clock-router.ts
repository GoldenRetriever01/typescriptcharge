import { observable } from "@trpc/server/observable"
import { z } from "zod"
import { Emitter } from "../common/emitter"
import { prisma } from "../prisma/client"
import { t } from "../trpc/init"
import { defaultWorldId } from "../worlds/world-router"
import type { ClockState } from "./clock-state"

const emitter = new Emitter<ClockState[]>()

export const clockRouter = t.router({
  clocks: t.procedure.subscription(async () => {
    const initial = await getClocks()
    return observable<ClockState[]>((emit) => {
      emit.next(initial)
      return emitter.subscribe(emit.next)
    })
  }),

  createClock: t.procedure.mutation(async () => {
    const clock = await prisma.clock.create({
      data: {
        worldId: defaultWorldId,
        name: "New clock",
        progress: 0,
        maxProgress: 4,
      },
    })
    emitter.emit(await getClocks())
    return clock
  }),

  deleteClock: t.procedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      await prisma.clock.delete({ where: { id: input.id } })
      emitter.emit(await getClocks())
    }),

  updateClock: t.procedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().optional(),
        progress: z.number().optional(),
        maxProgress: z.number().optional(),
      }),
    )
    .mutation(async ({ input: { id, ...data } }) => {
      await prisma.clock.update({ where: { id }, data })
      emitter.emit(await getClocks())
    }),
})

function getClocks() {
  return prisma.clock.findMany({
    where: { worldId: defaultWorldId },
    orderBy: { createdAt: "asc" },
  })
}
