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
import clsx from "clsx"
import type { ReactNode } from "react"
import { Book, Clock, Users } from "react-feather"
import type { DiscordUser } from "~/features/auth/discord"
import { getDiscordAuthUser } from "~/features/auth/discord"
import { truthyJoin } from "~/helpers/truthy-join"
import { LoadingSuspense } from "~/ui/loading"
import { clearButtonClass, raisedPanelClass } from "~/ui/styles"
import favicon from "./assets/favicon.svg"
import { discordUserAllowList } from "./features/auth/discord-allow-list"
import { getSession } from "./features/auth/session"
import { LiveCursors } from "./features/multiplayer/live-cursors"
import {
  defaultRoomId,
  defaultRoomInit,
} from "./features/multiplayer/liveblocks-client"
import {
  LiveblocksConnectionToggle,
  useLiveblocksEnabled,
} from "./features/multiplayer/liveblocks-connection-toggle"
import { RoomProvider } from "./features/multiplayer/liveblocks-react"
import { LogsButton } from "./features/multiplayer/logs"
import { getWorldData } from "./features/world/actions.server"
import { WorldTitle } from "./features/world/world-title"
import tailwind from "./generated/tailwind.css"
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
  const liveblocksEnabled = useLiveblocksEnabled()
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
        <div className="mx-auto flex min-h-screen flex-col gap-4 p-4">
          <AuthGuard>
            {({ discordUser }) => (
              <>
                <div className="mx-auto grid w-full max-w-screen-md gap-4">
                  <div className="my-2">
                    <MainNav />
                  </div>
                  <div className={clsx(raisedPanelClass, "p-4")}>
                    <LoadingSuspense>
                      <Outlet />
                    </LoadingSuspense>
                  </div>
                </div>
                <div className="sticky bottom-4 mt-auto">
                  <LogsButton />
                  {process.env.NODE_ENV !== "production" && (
                    <LiveblocksConnectionToggle />
                  )}
                </div>
                <EmptySuspense>
                  {liveblocksEnabled && (
                    <RoomProvider id={defaultRoomId} {...defaultRoomInit}>
                      <LiveCursors name={discordUser.username} />
                    </RoomProvider>
                  )}
                  <WorldTitle />
                </EmptySuspense>
              </>
            )}
          </AuthGuard>
        </div>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  )
}

function MainNav() {
  return (
    <nav className="flex flex-wrap items-center gap-6">
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
