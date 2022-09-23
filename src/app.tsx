import clsx from "clsx"
import { Clock, Home, Users } from "react-feather"
import { Link, Route, useRoute } from "wouter"
import { ClockList } from "./features/clocks/clock-list"
import { useStorage } from "./liveblocks"

const headerLinkClass = clsx(
  "font-header text-2xl uppercase tracking-wide inline-flex items-center gap-2 border-b-2",
)

export function App() {
  const world = useStorage((root) => root.world)
  return (
    <main className="max-w-screen-md mx-auto px-4 py-16 grid">
      <nav className="flex gap-6 items-center mb-6">
        <HeaderLink to="/">
          <Home size={20} /> Home
        </HeaderLink>
        <HeaderLink to="/characters">
          <Users size={20} /> Characters
        </HeaderLink>
        <HeaderLink to="/clocks">
          <Clock size={20} /> Clocks
        </HeaderLink>
      </nav>
      <Route path="/">
        <Card title={world.name}>
          <p>{world.description}</p>
        </Card>
      </Route>
      <Route path="/clocks">
        <Card title="Clocks">
          <ClockList />
        </Card>
      </Route>
      <Route path="/characters">
        <Card title="Characters">
          <p>
            Sit aliqua cillum et irure reprehenderit irure tempor eu amet.
            Tempor sunt excepteur tempor sint culpa irure. Cillum esse laboris
            sunt esse. Deserunt cillum cupidatat aliqua consequat aliqua esse
            deserunt laboris magna aliqua ex nostrud anim est.
          </p>
          <p>
            Fugiat tempor nostrud Lorem est dolor deserunt eu fugiat nostrud
            sint quis id elit. Dolore culpa sit tempor sunt mollit eu ad ea.
            Dolore do deserunt sit enim deserunt proident quis adipisicing ad
            culpa anim. Nostrud in culpa veniam elit cupidatat ad fugiat nostrud
            qui et incididunt officia mollit mollit. Consectetur magna magna
            enim aliquip incididunt. Reprehenderit culpa laboris exercitation
            nostrud. Ea sint ullamco velit nostrud ipsum.
          </p>
        </Card>
      </Route>
    </main>
  )
}

function HeaderLink({
  to,
  children,
}: {
  to: string
  children: React.ReactNode
}) {
  const [active] = useRoute(to)

  return (
    <Link
      to={to}
      className={clsx(
        "text-lg inline-flex uppercase items-center gap-1.5 border-b-2 transition",
        active
          ? "border-current"
          : "opacity-50 border-transparent hover:opacity-75",
      )}
    >
      {children}
    </Link>
  )
}

function Card({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="bg-gray-700 border-2 border-gray-600 p-4 shadow-md shadow-[rgba(0,0,0,0.25)] grid gap-4">
      <h1 className="font-header uppercase tracking-wide text-3xl">{title}</h1>
      {children}
    </div>
  )
}
