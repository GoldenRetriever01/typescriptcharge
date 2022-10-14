import { db } from "~/core/db.server"

const defaultWorldId = "default"

export function getDefaultWorld() {
  return db.world.upsert({
    where: { id: defaultWorldId },
    update: {},
    create: { id: defaultWorldId },
  })
}
