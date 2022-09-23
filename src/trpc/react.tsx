import { createTRPCReact } from "@trpc/react"
import type { appRouter } from "./app-router"

export const trpc = createTRPCReact<typeof appRouter>()
