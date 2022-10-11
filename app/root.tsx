import { autoUpdate, offset, size, useFloating } from "@floating-ui/react-dom"
import type { LinksFunction, LoaderArgs } from "@remix-run/node"
import {
  Links,
  LiveReload,
  Meta,
  NavLink,
  Outlet,
  Scripts,
  useLoaderData,
} from "@remix-run/react"
import clsx from "clsx"
import { Book, Clock, Users } from "lucide-react"
import type { ReactNode } from "react"
import type { TypedMetaFunction } from "remix-typedjson"
import { typedjson, useTypedLoaderData } from "remix-typedjson"
import { truthyJoin } from "~/helpers/truthy-join"
import { clearButtonClass, maxWidthContainer } from "~/ui/styles"
import favicon from "./assets/favicon.svg"
import { env } from "./env.server"
import { getSessionUser } from "./features/auth/session"
import { UserProvider } from "./features/auth/user-context"
import { DiceButton, DiceConfirmPanel } from "./features/dice/dice-button-d6"
import { LiveCursors } from "./features/multiplayer/live-cursors"
import {
  defaultRoomId,
  defaultRoomInit,
} from "./features/multiplayer/liveblocks-client"
import { RoomProvider } from "./features/multiplayer/liveblocks-react"
import { LiveblocksStorageProvider } from "./features/multiplayer/liveblocks-storage"
import { getLiveblocksStorage } from "./features/multiplayer/liveblocks-storage.server"
import {
  LogsPanel,
  LogsPanelButton,
  LogsPanelProvider,
} from "./features/multiplayer/logs"
import { PusherProvider } from "./features/multiplayer/pusher-client"
import { WorldTitle } from "./features/world/world-title"
import tailwind from "./generated/tailwind.css"
import { prisma } from "./prisma.server"
import { Portal } from "./ui/portal"

export const unstable_shouldReload = () => false

export async function loader({ request }: LoaderArgs) {
  async function getWorldLogs() {
    return prisma.diceLog.findMany({
      where: {
        roomId: defaultRoomId,
      },
      orderBy: {
        createdAt: "asc",
      },
      take: 20,
      select: {
        dice: true,
        intent: true,
        user: { select: { name: true } },
      },
    })
  }

  const [user, storage, logs] = await Promise.all([
    getSessionUser(request),
    getLiveblocksStorage(),
    getWorldLogs(),
  ])

  return typedjson({
    user,
    storage,
    logs,
    pusherKey: env.PUSHER_KEY,
    pusherCluster: env.PUSHER_CLUSTER,
  })
}
export { loader as rootLoader }

export const meta: TypedMetaFunction<typeof loader> = ({ data }) => {
  const title = truthyJoin(" | ", [
    data.storage.data.world?.name,
    "Charge Worlds",
  ])
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
    <Document>
      <AppContent />
    </Document>
  )
}

function Document({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className="font-body overflow-y-auto break-words bg-gray-800 text-gray-100"
      style={{ wordBreak: "break-word", scrollbarGutter: "stable" }}
    >
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <Scripts />
        <LiveReload />
      </body>
    </html>
  )
}

function AppContent() {
  const data = useLoaderData<typeof loader>()

  if (!data.user) {
    return (
      <div className={maxWidthContainer}>
        <main className="grid gap-4 p-8">
          <p>
            To access this world, please{" "}
            <a href="/auth/discord/login" className="underline">
              Login with Discord
            </a>
          </p>
          <p className="opacity-75">{`(i'll make this less jank later)`}</p>
        </main>
      </div>
    )
  }

  if (!data.user.isAllowed) {
    return (
      <div className={maxWidthContainer}>
        <main className="grid gap-4 p-8">
          <p>
            {`Sorry, you're not authorized to enter this world. `}
            <a href="/auth/logout" className="underline">
              Log out
            </a>
          </p>
          <p className="opacity-75">{`(i'll make this less jank later)`}</p>
        </main>
      </div>
    )
  }

  return (
    <LiveblocksStorageProvider storage={data.storage}>
      <PusherProvider
        pusherKey={data.pusherKey}
        pusherCluster={data.pusherCluster}
      >
        <RoomProvider id={defaultRoomId} {...defaultRoomInit}>
          <UserProvider user={data.user}>
            <div className="flex min-h-screen flex-col">
              <div className={maxWidthContainer}>
                <header className="my-6">
                  <MainNav />
                </header>
                <main>
                  <Outlet />
                </main>
              </div>
              <footer className="sticky bottom-0 mx-auto mt-auto w-full max-w-screen-2xl p-4">
                <FooterActions />
              </footer>
            </div>

            <LiveCursors name={data.user.name} />
            <WorldTitle />
          </UserProvider>
        </RoomProvider>
      </PusherProvider>
    </LiveblocksStorageProvider>
  )
}

function MainNav() {
  return (
    <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 sm:justify-start">
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

function FooterActions() {
  const data = useTypedLoaderData<typeof loader>()

  const floating = useFloating({
    placement: "top-end",
    strategy: "fixed", // fixed positioning causes less shifting while scrolling
    middleware: [
      offset(8),
      size({
        padding: 16,
        apply: ({ elements, availableWidth, availableHeight }) => {
          elements.floating.style.width = `${availableWidth}px`
          elements.floating.style.height = `${availableHeight}px`
        },
      }),
    ],
    whileElementsMounted: autoUpdate,
  })

  return (
    <LogsPanelProvider>
      <Portal>
        <div
          ref={floating.floating}
          className={clsx(
            "pointer-events-none flex h-fit flex-col items-end justify-end gap-4",
            floating.x === null && "opacity-0",
          )}
          style={{
            position: floating.strategy,
            left: floating.x ?? 0,
            top: floating.y ?? 0,
          }}
        >
          <div className="w-full max-w-xs flex-1 self-end [&>*]:pointer-events-auto">
            <LogsPanel logs={data.logs} />
          </div>
          <div className="contents [&>*]:pointer-events-auto">
            <DiceConfirmPanel />
          </div>
        </div>
      </Portal>

      <div
        className="flex flex-wrap items-center justify-end gap-2"
        ref={floating.reference}
      >
        <LogsPanelButton />
        <DiceButton />
      </div>
    </LogsPanelProvider>
  )
}
