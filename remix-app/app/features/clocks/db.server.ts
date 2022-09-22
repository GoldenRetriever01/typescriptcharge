import type { Clock } from "@prisma/client"
import { defaultWorldId } from "~/features/worlds/db.server"
import { prisma } from "~/prisma.server"

export function getClocks() {
  return prisma.clock.findMany({
    where: { worldId: defaultWorldId },
    orderBy: { createdAt: "asc" },
  })
}

export function createClock() {
  return prisma.clock.create({
    data: {
      name: "New Clock",
      progress: 0,
      maxProgress: 4,
      worldId: defaultWorldId,
    },
  })
}

export function updateClock(id: string, data: Partial<Clock>) {
  return prisma.clock.update({ where: { id }, data })
}

export function deleteClock(id: string) {
  return prisma.clock.delete({ where: { id } })
}
