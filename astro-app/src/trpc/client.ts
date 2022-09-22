import {
  createTRPCProxyClient,
  createWSClient,
  httpBatchLink,
  splitLink,
  wsLink,
} from "@trpc/client"
import type { AppRouter } from "./router"

export const client = createTRPCProxyClient<AppRouter>({
  links: [
    splitLink({
      condition: (op) => op.type === "subscription",
      true: wsLink({
        client: createWSClient({
          url: `ws://${window.location.host}/api/socket`,
        }),
      }),
      false: httpBatchLink({
        url: `/api/http`,
      }),
    }),
  ],
})
