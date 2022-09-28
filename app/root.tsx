import { autoUpdate, offset, size, useFloating } from "@floating-ui/react-dom"
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
import { truthyJoin } from "~/helpers/truthy-join"
import { SupabaseBrowserEnv } from "~/supabase-browser"
import { LoadingSuspense } from "~/ui/loading"
import { clearButtonClass, raisedPanelClass } from "~/ui/styles"
import favicon from "./assets/favicon.svg"
import { env } from "./env.server"
import type { SessionUser } from "./features/auth/session"
import { getSessionUser } from "./features/auth/session"
import { DiceButton, DiceConfirmPanel } from "./features/dice/dice-button-d6"
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
import { LogsPanel, LogsPanelButton } from "./features/multiplayer/logs"
import { getWorldData } from "./features/world/actions.server"
import { WorldTitle } from "./features/world/world-title"
import tailwind from "./generated/tailwind.css"
import { supabase } from "./supabase.server"
import { EmptySuspense } from "./ui/loading"
import { Portal } from "./ui/portal"

async function getWorldLogs() {
  const result = await supabase
    .from("dice-logs")
    .select("*")
    .eq("roomId", defaultRoomId)
    .order("createdAt", { ascending: false })
    .limit(20)

  if (result.error) {
    console.error("Failed to fetch world logs", result.error)
  }

  return result.data?.reverse() ?? []
}

export async function loader({ request }: LoaderArgs) {
  const [user, world, logs] = await Promise.all([
    getSessionUser(request),
    getWorldData(),
    getWorldLogs(),
  ])
  return {
    user,
    world,
    logs,
    supabaseUrl: env.SUPABASE_URL,
    supabaseAnonKey: env.SUPABASE_ANON_KEY,
  }
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
  const data = useLoaderData<typeof loader>()

  const liveblocksEnabled = useLiveblocksEnabled()

  return (
    <html
      lang="en"
      className="font-body overflow-y-auto break-words bg-gray-800 text-gray-100"
      style={{ wordBreak: "break-word", scrollbarGutter: "stable" }}
    >
      <head>
        <Meta />
        <Links />
        <SupabaseBrowserEnv
          url={data.supabaseUrl}
          anonKey={data.supabaseAnonKey}
        />
      </head>
      <body>
        <div className="mx-auto flex min-h-screen flex-col gap-4 p-4">
          <AuthGuard>
            {({ user }) => (
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

                <div className="sticky bottom-4 mx-auto mt-auto w-full max-w-screen-2xl">
                  <FooterActions />
                </div>

                <EmptySuspense>
                  {liveblocksEnabled && (
                    <RoomProvider id={defaultRoomId} {...defaultRoomInit}>
                      <LiveCursors name={user.username} />
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

function AuthGuard({
  children,
}: {
  children: (props: { user: SessionUser }) => ReactNode
}) {
  const data = useLoaderData<typeof loader>()

  if (!data.user) {
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

  if (!data.user.isAllowed) {
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

  return <>{children({ user: data.user })}</>
}

function FooterActions() {
  const data = useLoaderData<typeof loader>()

  const floating = useFloating({
    placement: "top-end",
    strategy: "fixed", // fixed positioning causes less shifting while scrolling
    middleware: [
      offset(8),
      size({
        padding: 16,
        apply: ({ elements, availableHeight }) => {
          elements.floating.style.height = `${availableHeight}px`
        },
      }),
    ],
    whileElementsMounted: autoUpdate,
  })

  return (
    <>
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
          <div className="flex-1 [&>*]:pointer-events-auto">
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
        {process.env.NODE_ENV !== "production" && (
          <LiveblocksConnectionToggle />
        )}
        <LogsPanelButton />
        <DiceButton />
      </div>
    </>
  )
}
