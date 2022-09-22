import type { LinksFunction, MetaFunction } from "@remix-run/node"
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react"
import tailwind from "./generated/tailwind.css"

const appName = "Charge Worlds"
const appDescription = "Virtual environment for the Charge RPG system"
const appUrl = "https://charge.mapleleaf.dev"

export const meta: MetaFunction = () => ({
  // eslint-disable-next-line unicorn/text-encoding-identifier-case
  "charset": "utf-8",
  "viewport": "width=device-width,initial-scale=1",

  "title": appName,
  "description": appDescription,

  "og:type": "website",
  "og:url": appUrl,
  "og:title": appName,
  "og:description": appDescription,

  "twitter:card": "summary_large_image",
  "twitter:url": appUrl,
  "twitter:title": appName,
  "twitter:description": appDescription,
})

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: "/build/fonts/rubik/variable.css" },
  { rel: "stylesheet", href: "/build/fonts/oswald/variable.css" },
  { rel: "stylesheet", href: tailwind },
]

export default function App() {
  return (
    <html lang="en" className="bg-black text-white font-body">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  )
}
