import "@fontsource/oswald/variable.css"
import "@fontsource/rubik/variable.css"
import { LiveList } from "@liveblocks/client"
import { ClientSideSuspense } from "@liveblocks/react"
import { render } from "preact"
import { StrictMode } from "preact/compat"
import { Router } from "wouter"
import { App } from "./app"
import { RoomProvider } from "./liveblocks"
import "./tailwind.css"

render(
  <StrictMode>
    <Router>
      <RoomProvider
        id="default"
        initialPresence={{}}
        initialStorage={{
          world: { name: "New World", description: "A brand new world" },
          clocks: new LiveList(),
        }}
      >
        <ClientSideSuspense fallback={<div>Loading...</div>}>
          {() => <App />}
        </ClientSideSuspense>
      </RoomProvider>
    </Router>
  </StrictMode>,
  document.querySelector("#root")!,
)
