import { prisma } from "~/db"
import { defaultWorldId } from "../worlds/db"

export function getClocks() {
  return prisma.clock.findMany({
    where: { worldId: defaultWorldId },
  })
}
