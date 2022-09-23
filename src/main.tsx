import "@fontsource/oswald/variable.css"
import "@fontsource/rubik/variable.css"
import { LiveList } from "@liveblocks/client"
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
        id={import.meta.env.PROD ? "default" : "default-dev"}
        initialPresence={{}}
        initialStorage={{
          world: { name: "New World", description: "A brand new world" },
          clocks: new LiveList(),
          characters: new LiveList(),
        }}
      >
        <App />
      </RoomProvider>
    </Router>
  </StrictMode>,
  document.querySelector("#root")!,
)
