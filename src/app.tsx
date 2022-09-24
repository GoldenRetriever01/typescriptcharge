import { Book, Clock, Users } from "react-feather"
import { Link, Route, useRoute } from "wouter"
import { CharacterSheet } from "./features/characters/character-sheet"
import { ClockList } from "./features/clocks/clock-list"
import type { World } from "./features/world/world"
import { isRendered } from "./helpers/react"
import { useMutation, useStorage } from "./liveblocks"
import { Field } from "./ui/field"
import { LoadingSuspense } from "./ui/loading"
import { clearButtonClass, inputClass, textAreaClass } from "./ui/styles"

export function App() {
  return (
    <main className="mx-auto grid max-w-screen-md px-4 py-6">
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
      <Route path="/">
        <LoadingSuspense>
          <WorldEditor />
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

function WorldEditor() {
  const world = useStorage((root) => root.world) ?? {
    name: "New World",
    description: "A brand new world",
  }

  const updateWorld = useMutation((context, updates: Partial<World>) => {
    context.storage.set("world", { ...world, ...updates })
  }, [])

  return (
    <CardSection>
      <Field label="Name">
        <input
          placeholder="What is this place?"
          className={inputClass}
          value={world.name}
          onChange={(e) => updateWorld({ name: e.target.value })}
        />
      </Field>
      <Field label="Description">
        <textarea
          placeholder="How's the weather?"
          className={textAreaClass}
          value={world.description}
          onChange={(e) => updateWorld({ description: e.target.value })}
        />
      </Field>
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
    // eslint-disable-next-line tailwindcss/no-contradicting-classname
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
