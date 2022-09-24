import { LiveList } from "@liveblocks/client"
import clsx from "clsx"
import TextArea from "react-expanding-textarea"
import { Plus } from "react-feather"
import { Link, useLocation } from "wouter"
import { entriesTyped } from "../../helpers/entries-typed"
import { useMutation, useStorage } from "../../liveblocks"
import { Button } from "../../ui/button"
import { Counter, DotCounter } from "../../ui/counter"
import { clearButtonClass } from "../../ui/styles"
import { Clock } from "../clocks/clock"
import { characterActionLibrary } from "./character-actions"
import type { Character } from "./character-sheet-data"

const dividerClass = "border-gray-600"

export function CharacterSheet({ characterId }: { characterId?: string }) {
  const [, setLocation] = useLocation()

  const characters = useStorage((root) => root.characters) ?? []

  const currentCharacter =
    characters.find((c) => c.id === characterId) ?? characters[0]

  const createCharacter = useMutation((context) => {
    let characters = context.storage.get("characters")
    if (!characters) {
      characters = new LiveList()
      context.storage.set("characters", characters)
    }

    const character: Character = {
      id: crypto.randomUUID(),
      name: "New Character",
      group: "",
      concept: "",
      appearance: "",
      ties: "",
      momentum: 2,
      stress: 0,
      condition: "",
      actions: {},
      talents: "",
    }

    characters.push(character)

    setLocation(`/characters/${character.id}`)
  }, [])

  return (
    <>
      <nav className="flex items-start justify-between">
        <div className="flex flex-wrap gap-4">
          {characters.map((character) => (
            <Link
              key={character.id}
              to={`/characters/${character.id}`}
              className={clearButtonClass(character === currentCharacter)}
            >
              {character.name || "Unnamed"}
            </Link>
          ))}
          {characters.length === 0 && (
            <p className="opacity-70">No characters found</p>
          )}
        </div>
        <div className="flex-1" />
        <Button className={clearButtonClass(false)} onClick={createCharacter}>
          <Plus />
          Create
        </Button>
      </nav>

      {currentCharacter && (
        <>
          <hr className={dividerClass} />
          <CharacterSheetEditor character={currentCharacter} />
        </>
      )}
    </>
  )
}

function CharacterSheetEditor({ character }: { character: Character }) {
  const updateCharacter = useMutation(
    (context, updates: Partial<Omit<Character, "id">>) => {
      const characters = context.storage.get("characters")
      if (!characters) return

      const characterIndex = characters.findIndex((c) => c.id === character.id)
      if (characterIndex === -1) return

      characters.set(characterIndex, { ...character, ...updates })
    },
    [character],
  )

  const inputBaseClass = clsx(
    "block w-full resize-none rounded-md bg-black/25 transition focus:bg-black/50 focus:outline-none",
  )

  const inputClass = clsx(inputBaseClass, "h-12 px-3 leading-none")

  const textAreaClass = clsx(inputBaseClass, "p-3")

  return (
    <div className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid content-between gap-4">
          <Field label="Name">
            <input
              type="text"
              placeholder="What should we call you?"
              value={character.name}
              onChange={(e) => updateCharacter({ name: e.target.value })}
              className={inputClass}
            />
          </Field>
          <Field label="Group">
            <input
              type="text"
              placeholder="Whom do you side with?"
              value={character.group}
              onChange={(e) => updateCharacter({ group: e.target.value })}
              className={inputClass}
            />
          </Field>
          <Field as="div" label="Momentum">
            <div className={clsx(inputClass, "grid place-items-center")}>
              <Counter
                value={character.momentum}
                onChange={(momentum) => updateCharacter({ momentum })}
              />
            </div>
          </Field>
        </div>

        <div className="grid gap-4">
          <Clock
            name="Stress"
            progress={character.stress}
            maxProgress={4}
            onProgressChange={(stress) => updateCharacter({ stress })}
          />
          <Field label="Condition">
            <input
              placeholder="How're you doing?"
              value={character.condition}
              onChange={(e) => updateCharacter({ condition: e.target.value })}
              className={inputClass}
            />
          </Field>
        </div>
      </div>

      <hr className={dividerClass} />

      <Field as="section" label="Actions">
        <div className="grid gap-4 sm:grid-cols-3">
          {entriesTyped(characterActionLibrary).map(([category, actions]) => (
            <div
              key={category}
              className="flex flex-col items-center rounded-md bg-black/25 p-4 text-center"
            >
              <h4 className="font-header mb-4 text-center text-xl leading-tight tracking-wide">
                {category}
              </h4>
              <ul className="grid gap-4">
                {actions.map((action) => (
                  <Field as="li" key={action} label={action}>
                    <DotCounter
                      value={character.actions[action]?.level ?? 0}
                      max={4}
                      onChange={(level) => {
                        updateCharacter({
                          actions: {
                            ...character.actions,
                            [action]: { level },
                          },
                        })
                      }}
                    />
                  </Field>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Field>

      <hr className={dividerClass} />

      <div className="grid gap-4">
        <Field label="Concept">
          <TextArea
            placeholder="Describe yourself."
            value={character.concept}
            onChange={(e) => updateCharacter({ concept: e.target.value })}
            className={textAreaClass}
          />
        </Field>
        <Field label="Appearance">
          <TextArea
            placeholder="How do you look? What do you like to wear?"
            value={character.appearance}
            onChange={(e) => updateCharacter({ appearance: e.target.value })}
            className={textAreaClass}
          />
        </Field>
        <Field label="Ties">
          <TextArea
            placeholder="Who are your friends and enemies?"
            value={character.ties}
            onChange={(e) => updateCharacter({ ties: e.target.value })}
            className={textAreaClass}
          />
        </Field>
        <Field label="Talents">
          <TextArea
            placeholder="stat buffs stat buffs stat buffs"
            value={character.talents}
            onChange={(e) => updateCharacter({ talents: e.target.value })}
            className={textAreaClass}
          />
        </Field>
      </div>
    </div>
  )
}

function Field({
  label,
  children,
  className,
  as: As = "label",
}: {
  label: React.ReactNode
  children: React.ReactNode
  className?: string
  as?: React.ElementType
}) {
  return (
    <As className={className}>
      <div className="mb-1.5 text-sm font-medium leading-none">{label}</div>
      {children}
    </As>
  )
}
