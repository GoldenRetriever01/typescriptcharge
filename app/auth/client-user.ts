import type { User } from "@prisma/client"

export type ClientUser = {
  name: string
}

export function toClientUser(user: User) {
  return { name: user.name }
}
