import { createContext, useContext } from "react"
import type { ClientMembership } from "./client-membership"

const ClientMembershipContext = createContext<ClientMembership | undefined>(
  undefined,
)

export function ClientMembershipProvider({
  membership,
  children,
}: {
  membership: ClientMembership
  children: React.ReactNode
}) {
  return (
    <ClientMembershipContext.Provider value={membership}>
      {children}
    </ClientMembershipContext.Provider>
  )
}

export function useMembership() {
  const membership = useContext(ClientMembershipContext)
  return {
    isAdmin: membership?.role === "GM",
    isPlayer: membership?.role === "PLAYER",
  }
}
