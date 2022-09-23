import "@fontsource/oswald/variable.css"
import "@fontsource/rubik/variable.css"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { App } from "./app"
import "./tailwind.css"
import { clientOptions } from "./trpc/client"
import { trpc } from "./trpc/react"

const trpcClient = trpc.createClient(clientOptions)
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
