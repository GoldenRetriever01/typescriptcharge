import { PrismaClient } from "@prisma/client"

declare global {
  var prismaClient: PrismaClient | undefined
}

const prisma = (global.prismaClient ??= new PrismaClient())

const defaultWorldId = "default"

export function getWorld() {
  return prisma.world.upsert({
    where: { id: defaultWorldId },
    update: {},
    create: { id: defaultWorldId },
  })
}
