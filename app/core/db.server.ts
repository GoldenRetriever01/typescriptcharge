import { PrismaClient } from "@prisma/client"

declare global {
  var prismaClient: PrismaClient | undefined
}

export const db = (globalThis.prismaClient ??= new PrismaClient())
