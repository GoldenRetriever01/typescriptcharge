import {
  createTRPCProxyClient,
  createWSClient,
  httpBatchLink,
  splitLink,
  wsLink,
} from "@trpc/client"
import type { appRouter } from "./app-router"

const { protocol, host } = window.location
const socketUrl = `${protocol === "https:" ? "wss" : "ws"}://${host}/api/socket`

export const clientOptions = {
  links: [
    splitLink({
      condition: (op) => op.type === "subscription",
      false: httpBatchLink({ url: "/api/http" }),
      true: wsLink({
        client: createWSClient({ url: socketUrl }),
      }),
    }),
  ],
}

export const proxyClient =
  createTRPCProxyClient<typeof appRouter>(clientOptions)
