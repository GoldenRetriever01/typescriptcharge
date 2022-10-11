import type { Membership, Role } from "@prisma/client"

export type ClientMembership = {
  role: Role
}

export function toClientMembership(membership: Membership): ClientMembership {
  return { role: membership.role }
}
