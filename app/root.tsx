import { autoUpdate, offset, size, useFloating } from "@floating-ui/react-dom"
import type {
  ErrorBoundaryComponent,
  LinksFunction,
  LoaderArgs,
} from "@remix-run/node"
import {
  Form,
  Link,
  Links,
  LiveReload,
  Meta,
  NavLink,
  Outlet,
  Scripts,
  useCatch,
  useTransition,
} from "@remix-run/react"
import clsx from "clsx"
import { Book, Clock, HandMetal, LogOut, Users, Wrench } from "lucide-react"
import type { ComponentPropsWithoutRef, ReactNode } from "react"
import { useRef } from "react"
import useMeasure from "react-use-measure"
import type { TypedMetaFunction } from "remix-typedjson"
import { typedjson, useTypedLoaderData } from "remix-typedjson"
import { route } from "routes-gen"
import { truthyJoin } from "~/helpers/truthy-join"
import { LiveCursors } from "~/multiplayer/live-cursors"
import { defaultRoomId, defaultRoomInit } from "~/multiplayer/liveblocks-client"
import { RoomProvider } from "~/multiplayer/liveblocks-react"
import { LiveblocksStorageProvider } from "~/multiplayer/liveblocks-storage"
import { getLiveblocksStorage } from "~/multiplayer/liveblocks-storage.server"
import {
  LogsPanel,
  LogsPanelButton,
  LogsPanelProvider,
} from "~/multiplayer/logs"
import { PusherProvider } from "~/multiplayer/pusher-client"
import { maxWidthContainerClass, navLinkClass } from "~/ui/styles"
import favicon from "./assets/favicon.svg"
import { toClientMembership } from "./auth/client-membership"
import { toClientUser } from "./auth/client-user"
import { requireMembership } from "./auth/require-membership"
import { requireSessionUser } from "./auth/session"
import { db } from "./core/db.server"
import { env } from "./core/env.server"
import { DiceButton, DiceConfirmPanel } from "./dice/dice-button-d6"
import tailwind from "./generated/tailwind.css"
import { getDefaultWorld } from "./routes/world/world-db.server"
import { WorldTitle } from "./routes/world/world-title"
import { LoadingSpinner } from "./ui/loading"
import { Portal } from "./ui/portal"

async function loadWorldLogs() {
  return db.diceLog.findMany({
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

export const unstable_shouldReload = () => false

export async function loader({ request }: LoaderArgs) {
  const user = await requireSessionUser(request)
  const world = await getDefaultWorld()
  const membership = await requireMembership(user, world)

  const [storage, logs] = await Promise.all([
    getLiveblocksStorage(),
    loadWorldLogs(),
  ])

  return typedjson({
    user: toClientUser(user),
    membership: toClientMembership(membership),
    storage,
    logs,
    pusherKey: env.PUSHER_KEY,
    pusherCluster: env.PUSHER_CLUSTER,
  })
}

export const meta: TypedMetaFunction<typeof loader> = ({ data }) => {
  const title = truthyJoin(" | ", [
    data?.storage.data.world?.name,
    "Charge Worlds",
  ])
  const description = "Virtual environment for the Charge RPG system"
  const siteUrl = "https://charge-worlds.mapleleaf.dev"

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
  const data = useTypedLoaderData<typeof loader>()
  const [ref, bounds] = useMeasure()

  return (
    <Document>
      <LiveblocksStorageProvider storage={data.storage}>
        <PusherProvider
          pusherKey={data.pusherKey}
          pusherCluster={data.pusherCluster}
        >
          <RoomProvider id={defaultRoomId} {...defaultRoomInit}>
            <div className="flex min-h-screen flex-col">
              <div className={maxWidthContainerClass}>
                <header className="my-6">
                  <MainNav />
                </header>
                <main ref={ref}>
                  <Outlet />
                </main>
              </div>
              <footer
                className={clsx(maxWidthContainerClass, "mt-6 flex gap-4")}
              >
                <Form method="post" action="/auth/logout" reloadDocument>
                  <button type="submit" className={clsx(navLinkClass())}>
                    <LogOut size={20} />
                    SIGN OUT
                  </button>
                </Form>
                <HellYeah />
              </footer>
              <aside className="sticky bottom-0 p-4 max-w-screen-2xl mx-auto mt-auto w-full pointer-events-none">
                <div className="w-fit ml-auto pointer-events-auto">
                  <FooterActions />
                </div>
              </aside>
            </div>

            <LiveCursors
              name={data.user.name}
              avatar={data.user.avatar ?? "ineedadefault.png"}
              leftOffset={bounds.left}
            />
            <WorldTitle />
          </RoomProvider>
        </PusherProvider>
      </LiveblocksStorageProvider>
    </Document>
  )
}

export function CatchBoundary() {
  return (
    <Document>
      <div className={maxWidthContainerClass}>
        <div className="py-8">
          <CatchBoundaryContent />
        </div>
      </div>
    </Document>
  )
}

export function ErrorBoundary({
  error,
}: ComponentPropsWithoutRef<ErrorBoundaryComponent>) {
  const message =
    error instanceof Error ? error.stack || error.message : String(error)

  return (
    <Document>
      <div className={maxWidthContainerClass}>
        <div className="grid gap-4 py-4">
          <h1 className="font-header text-4xl font-light">
            Oops! Something went wrong.
          </h1>
          <pre className="overflow-x-auto rounded-md bg-black/50 p-4">
            {message}
          </pre>
          <a href="/" className="underline hover:no-underline">
            Return to safety
          </a>
        </div>
      </div>
    </Document>
  )
}

function CatchBoundaryContent() {
  const response = useCatch()

  if (response.status === 401) {
    return (
      <SystemMessage>
        <p>
          To see this, please{" "}
          <a href={route("/auth/discord/login")} className="underline">
            Login with Discord
          </a>
        </p>
      </SystemMessage>
    )
  }

  if (response.status === 403) {
    return (
      <SystemMessage>
        <p>
          {`Sorry, you're not allowed to see this. `}
          <Link to={route("/auth/logout")} className="underline">
            Log out
          </Link>
        </p>
      </SystemMessage>
    )
  }

  return (
    <SystemMessage>
      <p>Oops! Something went wrong.</p>
    </SystemMessage>
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
        <PendingIndicator />
      </body>
    </html>
  )
}

function PendingIndicator() {
  const transition = useTransition()
  const pending = transition.state !== "idle"
  return (
    <div
      className={clsx(
        "pointer-events-none fixed left-0 bottom-0 p-4 transition",
        pending ? "opacity-100" : "opacity-0",
      )}
    >
      <LoadingSpinner />
    </div>
  )
}

function SystemMessage({ children }: { children: ReactNode }) {
  return (
    <section className="grid gap-4">
      {children}
      <p className="opacity-75">{`(i'll make this less jank later)`}</p>
      <HellYeah />
    </section>
  )
}

function HellYeah() {
  const yeahRef = useRef<HTMLAudioElement>(null)
  const onHellYeah = () => {
    if (!yeahRef.current) return

    yeahRef.current.currentTime = 0
    void yeahRef.current.play()
  }

  return (
    <button className={clsx(navLinkClass())} onClick={onHellYeah}>
      <HandMetal size={20} />
      HELL YEAH
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <audio src="/yeah.mp3" ref={yeahRef} className="h-0" />
    </button>
  )
}

function MainNav() {
  const { membership } = useTypedLoaderData<typeof loader>()
  return (
    <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 sm:justify-start">
      <NavLink to={route("/")} className={navLinkClass}>
        <Book size={20} /> World
      </NavLink>
      <NavLink to={route("/characters")} className={navLinkClass} end={false}>
        <Users size={20} /> Characters
      </NavLink>
      <NavLink to={route("/clocks")} className={navLinkClass}>
        <Clock size={20} /> Clocks
      </NavLink>
      {membership.role === "GM" && (
        <NavLink to={route("/settings")} className={navLinkClass}>
          <Wrench size={20} /> Settings
        </NavLink>
      )}
    </nav>
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
