import { redirect } from "@remix-run/node"
import { z } from "zod"
import { defaultWorldId } from "~/features/worlds/db.server"
import { defineCrudActions } from "~/helpers/crud.server"
import { prisma } from "~/prisma.server"
import { clockUpdateSchema } from "./clock-state"

export function getClocks() {
  return prisma.clock.findMany({
    where: { worldId: defaultWorldId },
    orderBy: { createdAt: "asc" },
  })
}

export const clockActions = defineCrudActions({
  post: {
    async action() {
      await prisma.clock.create({
        data: {
          name: "New Clock",
          progress: 0,
          maxProgress: 4,
          worldId: defaultWorldId,
        },
      })
      return redirect("/")
    },
  },

  patch: {
    input: clockUpdateSchema,
    async action({ id, ...data }) {
      await prisma.clock.update({ where: { id }, data })
      return redirect("/")
    },
  },

  delete: {
    input: z.object({ id: z.string() }),
    async action({ id }) {
      await prisma.clock.delete({ where: { id } })
      return redirect("/")
    },
  },
})
