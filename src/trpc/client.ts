import {
  createTRPCProxyClient,
  createWSClient,
  httpBatchLink,
  splitLink,
  wsLink,
} from "@trpc/client"
import type { appRouter } from "./app-router"

export const clientOptions = {
  links: [
    splitLink({
      condition: (op) => op.type === "subscription",
      false: httpBatchLink({ url: "/api/http" }),
      true: wsLink({
        client: createWSClient({
          url: `${window.location.protocol === "https:" ? "wss" : "ws"}://${
            window.location.host
          }/api/socket`,
        }),
      }),
    }),
  ],
}

export const proxyClient =
  createTRPCProxyClient<typeof appRouter>(clientOptions)
