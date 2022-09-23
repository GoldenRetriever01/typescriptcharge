import "@fontsource/oswald/variable.css"
import "@fontsource/rubik/variable.css"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { createWSClient, httpBatchLink, splitLink, wsLink } from "@trpc/client"
import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { App } from "./app"
import "./tailwind.css"
import { trpc } from "./trpc/react"

const trpcClient = trpc.createClient({
  links: [
    splitLink({
      condition: (op) => op.type === "subscription",
      false: httpBatchLink({ url: "/api/http" }),
      true: wsLink({
        client: createWSClient({
          url: `ws://${window.location.host}/api/socket`,
        }),
      }),
    }),
  ],
})

const queryClient = new QueryClient()

createRoot(document.querySelector("#root")!).render(
  <StrictMode>
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </trpc.Provider>
  </StrictMode>,
)
