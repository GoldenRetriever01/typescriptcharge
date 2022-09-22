import type { LinksFunction, MetaFunction } from "@remix-run/node"
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react"
import { ActionScrollRestoration } from "~/ui/action-scroll-restoration"
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
    <html lang="en" className="bg-gray-800 text-gray-100 font-body">
      <head>
        <Meta />
        <Links />
        <Scripts />
        <LiveReload />
        <ScrollRestoration />
      </head>
      <body className="px-4 py-16 max-w-screen-md mx-auto grid gap-8">
        <Outlet />
        <ActionScrollRestoration />
      </body>
    </html>
  )
}
