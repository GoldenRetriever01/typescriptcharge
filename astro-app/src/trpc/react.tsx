import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { createWSClient, httpBatchLink, splitLink, wsLink } from "@trpc/client"
import { createTRPCClient, createTRPCReact } from "@trpc/react"
import type { ReactNode } from "react"
import type { AppRouter } from "./router"

export const TRPC = createTRPCReact<AppRouter>()

const trpcClient = createTRPCClient({
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

const queryClient = new QueryClient()

export function TrpcProvider({ children }: { children: ReactNode }) {
  return (
    <TRPC.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </TRPC.Provider>
  )
}
