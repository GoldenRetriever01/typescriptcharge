import { Clock, Home, Users } from "react-feather"
import { Link, Route, useRoute } from "wouter"
import { CharacterSheet } from "./features/characters/character-sheet"
import { ClockList } from "./features/clocks/clock-list"
import { isRendered } from "./helpers/react"
import { useStorage } from "./liveblocks"
import { LoadingSuspense } from "./ui/loading"
import { clearButtonClass } from "./ui/styles"

export function App() {
  return (
    <main className="mx-auto grid max-w-screen-md px-4 py-6">
      <nav className="mb-6 flex items-center gap-6">
        <HeaderLink to="/">
          <Home size={20} /> Home
        </HeaderLink>
        <HeaderLink to="/characters" partial>
          <Users size={20} /> Characters
        </HeaderLink>
        <HeaderLink to="/clocks">
          <Clock size={20} /> Clocks
        </HeaderLink>
      </nav>
      <Route path="/">
        <LoadingSuspense>
          <HomeCard />
        </LoadingSuspense>
      </Route>
      <Route path="/clocks">
        <CardSection title="Clocks">
          <LoadingSuspense>
            <ClockList />
          </LoadingSuspense>
        </CardSection>
      </Route>
      <Route path="/characters/:id?">
        {(params) => (
          <CardSection>
            <LoadingSuspense>
              <CharacterSheet characterId={params.id} />
            </LoadingSuspense>
          </CardSection>
        )}
      </Route>
    </main>
  )
}

function HomeCard() {
  const world = useStorage((root) => root.world) ?? {
    name: "New World",
    description: "A brand new world",
  }
  return (
    <CardSection title={world.name}>
      <p>{world.description}</p>
    </CardSection>
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
  const [active] = useRoute(partial ? to + "/:rest*" : to)
  return (
    <Link to={to} className={clearButtonClass(active)}>
      {children}
    </Link>
  )
}

function CardSection({
  title,
  children,
}: {
  title?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <section className="grid gap-4 border-2 border-gray-600 bg-gray-700 p-4 shadow-md shadow-[rgba(0,0,0,0.25)]">
      {isRendered(title) && (
        <h1 className="font-header text-3xl uppercase tracking-wide">
          {title}
        </h1>
      )}
      {children}
    </section>
  )
}
