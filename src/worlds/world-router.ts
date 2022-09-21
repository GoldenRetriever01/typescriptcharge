import { observable } from "@trpc/server/observable"
import { z } from "zod"
import { Emitter } from "../common/emitter"
import { prisma } from "../prisma/client"
import { t } from "../trpc/init"
import type { WorldState } from "./world-state"

export const defaultWorldId = "default"
const worldEmitter = new Emitter<WorldState>()

async function getWorld() {
  return await prisma.world.upsert({
    where: { id: defaultWorldId },
    update: {},
    create: {},
  })
}

export const worldRouter = t.router({
  getWorld: t.procedure.query(() => getWorld()),

  world: t.procedure.subscription(async () => {
    const initialWorld = await getWorld()
    return observable<WorldState>((emit) => {
      emit.next(initialWorld)
      return worldEmitter.subscribe(emit.next)
    })
  }),

  updateWorld: t.procedure
    .input(z.object({ name: z.string(), description: z.string() }).partial())
    .mutation(async ({ input }) => {
      const world = await prisma.world.update({
        where: { id: defaultWorldId },
        data: input,
      })
      worldEmitter.emit(world)
      return world
    }),
})
