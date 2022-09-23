import "@fontsource/oswald/variable.css"
import "@fontsource/rubik/variable.css"
import { ClientSideSuspense } from "@liveblocks/react"
import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { App } from "./app2"
import { RoomProvider } from "./liveblocks"
import "./tailwind.css"

createRoot(document.querySelector("#root")!).render(
  <StrictMode>
    <RoomProvider id="default" initialPresence={{}}>
      <ClientSideSuspense fallback={<div>Loading...</div>}>
        {() => <App />}
      </ClientSideSuspense>
    </RoomProvider>
  </StrictMode>,
)
