import type { LinksFunction, LoaderArgs, MetaFunction } from "@remix-run/node"
import {
  Links,
  LiveReload,
  Meta,
  NavLink,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react"
import type { ReactNode } from "react"
import { useEffect } from "react"
import { Book, Clock, Users } from "react-feather"
import { truthyJoin } from "~/helpers/truthy-join"
import { defaultRoomId, defaultRoomInit } from "~/liveblocks/client"
import {
  RoomProvider,
  useOthers,
  useStorage,
  useUpdateMyPresence,
} from "~/liveblocks/react"
import { Cursor } from "~/ui/cursor"
import { Portal } from "~/ui/portal"
import { clearButtonClass } from "~/ui/styles"
import favicon from "./assets/favicon.svg"
import { discordUserAllowList } from "./features/auth/discord-allow-list"
import { getSession } from "./features/auth/session"
import { getWorldData } from "./features/world/actions.server"
import tailwind from "./generated/tailwind.css"
import type { DiscordUser } from "./helpers/discord"
import { getDiscordAuthUser } from "./helpers/discord"
import { EmptySuspense } from "./ui/loading"

export async function loader({ request }: LoaderArgs) {
  const session = await getSession(request)

  const discordUser =
    session &&
    (await getDiscordAuthUser(session.discordAccessToken).catch((error) => {
      console.warn("Failed to fetch Discord user", error)
    }))

  const isAllowed = discordUser && discordUserAllowList.includes(discordUser.id)

  const world = await getWorldData()

  return { discordUser, isAllowed, world }
}

export const unstable_shouldReload = () => false

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  const title = truthyJoin(" | ", [data.world?.name, "Charge Worlds"])
  const description = "Virtual environment for the Charge RPG system"
  const siteUrl = "https://charge-worlds.netlify.app/"

  return {
    // eslint-disable-next-line unicorn/text-encoding-identifier-case
    "charset": "utf-8",
    "viewport": "width=device-width,initial-scale=1",

    title,
    description,
    "theme-color": "#1e293b",

    "og:type": "website",
    "og:url": siteUrl,
    "og:title": title,
    "og:description": description,

    "twitter:card": "summary_large_image",
    "twitter:url": siteUrl,
    "twitter:title": title,
    "twitter:description": description,
  }
}

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: "/build/fonts/rubik/variable.css" },
  { rel: "stylesheet", href: "/build/fonts/oswald/variable.css" },
  { rel: "stylesheet", href: tailwind },
  { rel: "icon", href: favicon },
]

export default function App() {
  return (
    <html
      lang="en"
      className="font-body overflow-x-hidden overflow-y-scroll bg-gray-800 text-gray-100"
    >
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <main className="mx-auto grid max-w-screen-md px-4 py-6">
          <AuthGuard>
            {({ discordUser }) => (
              <RoomProvider id={defaultRoomId} {...defaultRoomInit}>
                <MainNav />
                <Outlet />
                <EmptySuspense>
                  <LiveCursors name={discordUser.username} />
                  <WorldTitleUpdater />
                </EmptySuspense>
              </RoomProvider>
            )}
          </AuthGuard>
        </main>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  )
}

function MainNav() {
  return (
    <nav className="mb-6 flex items-center gap-6">
      <HeaderLink to="/">
        <Book size={20} /> World
      </HeaderLink>
      <HeaderLink to="/characters" partial>
        <Users size={20} /> Characters
      </HeaderLink>
      <HeaderLink to="/clocks">
        <Clock size={20} /> Clocks
      </HeaderLink>
    </nav>
  )
}

function HeaderLink({
  to,
  children,
  partial,
}: {
  to: string
  children: React.ReactNode
  partial?: boolean
}) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => clearButtonClass(isActive)}
      end={partial ? false : undefined}
    >
      {children}
    </NavLink>
  )
}

function AuthGuard({
  children,
}: {
  children: (props: { discordUser: DiscordUser }) => ReactNode
}) {
  const data = useLoaderData<typeof loader>()

  if (!data.discordUser) {
    return (
      <main className="grid gap-4 p-8">
        <p>
          To access this world, please{" "}
          <a href="/auth/discord/login" className="underline">
            Login with Discord
          </a>
        </p>
        <p className="opacity-75">{`(i'll make this less jank later)`}</p>
      </main>
    )
  }

  if (!data.isAllowed) {
    return (
      <main className="grid gap-4 p-8">
        <p>
          {`Sorry, you're not authorized to enter this world.`}
          <a href="/auth/logout" className="underline">
            Log out
          </a>
        </p>
        <p className="opacity-75">{`(i'll make this less jank later)`}</p>
      </main>
    )
  }

  return <>{children({ discordUser: data.discordUser })}</>
}

function WorldTitleUpdater() {
  const worldName = useStorage((root) => root.world?.name)
  useEffect(() => {
    document.title = truthyJoin(" | ", [worldName, "Charge Worlds"])
  }, [worldName])
  return <></>
}

function LiveCursors({ name }: { name: string }) {
  const others = useOthers()
  const update = useUpdateMyPresence()

  useEffect(() => {
    const handleMove = (event: MouseEvent) => {
      update({ cursor: { x: event.pageX, y: event.pageY, name } })
    }
    document.addEventListener("pointermove", handleMove)
    return () => document.removeEventListener("pointermove", handleMove)
  })

  return (
    <Portal>
      {others.map((other) => {
        if (!other.presence.cursor) return
        return <Cursor key={other.id} {...other.presence.cursor} />
      })}
    </Portal>
  )
}
