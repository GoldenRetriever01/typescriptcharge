import { Clock, Home, Users } from "react-feather"
import { Link, Route, useRoute } from "wouter"
import { CharacterHub } from "./features/characters/character-hub"
import { ClockList } from "./features/clocks/clock-list"
import { isRendered } from "./helpers/react"
import { useStorage } from "./liveblocks"
import { LoadingSuspense } from "./ui/loading"
import { navLinkClass } from "./ui/styles"

export function App() {
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
      <Route path="/characters">
        <CardSection>
          <LoadingSuspense>
            <CharacterHub />
          </LoadingSuspense>
        </CardSection>
      </Route>
    </main>
  )
}

function HomeCard() {
  const world = useStorage((root) => root.world)
  return (
    <CardSection title={world.name}>
      <p>{world.description}</p>
    </CardSection>
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
    <Link to={to} className={navLinkClass(active)}>
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
    <section className="bg-gray-700 border-2 border-gray-600 p-4 shadow-md shadow-[rgba(0,0,0,0.25)] grid gap-4">
      {isRendered(title) && (
        <h1 className="font-header uppercase tracking-wide text-3xl">
          {title}
        </h1>
      )}
      {children}
    </section>
  )
}
