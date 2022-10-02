import { PrismaClient } from "@prisma/client"

declare global {
  var prismaClient: PrismaClient | undefined
}

export const prisma = (globalThis.prismaClient ??= new PrismaClient())
