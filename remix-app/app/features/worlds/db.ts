import { prisma } from "~/db"

export const defaultWorldId = "default"

export function getWorld() {
  return prisma.world.upsert({
    where: { id: defaultWorldId },
    update: {},
    create: { id: defaultWorldId },
  })
}
