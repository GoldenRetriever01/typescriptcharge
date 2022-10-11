import { prisma } from "~/prisma.server"

const defaultWorldId = "default"

export function getDefaultWorld(defaultAdminDiscordId: string) {
  return prisma.world.upsert({
    where: { id: defaultWorldId },
    update: {},
    create: { id: defaultWorldId, adminDiscordId: defaultAdminDiscordId },
  })
}
