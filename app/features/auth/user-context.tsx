import { createContextWrapper } from "~/helpers/context"
import type { SessionUser } from "./session"

export const [useUserContext, UserProvider] = createContextWrapper(
  ({ user }: { user: SessionUser }) => user,
)
