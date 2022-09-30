import { Dialog, Transition } from "@headlessui/react"
import { LiveList } from "@liveblocks/client"
import { useStore } from "@nanostores/react"
import { Link, useFetcher, useNavigate, useParams } from "@remix-run/react"
import clsx from "clsx"
import { atom } from "nanostores"
import { Fragment, useState } from "react"
import TextArea from "react-expanding-textarea"
import { Hexagon, Plus, Trash, X } from "react-feather"
import { characterActionLibrary } from "~/features/characters/character-actions"
import type { Character } from "~/features/characters/character-sheet-data"
import { Clock } from "~/features/clocks/clock"
import { setDiceRoll } from "~/features/dice/dice-button-d6"
import { syncStoreWithLiveblocks } from "~/features/multiplayer/liveblocks-client"
import { entriesTyped } from "~/helpers/entries-typed"
import { Button } from "~/ui/button"
import { Counter, DotCounter } from "~/ui/counter"
import { Field } from "~/ui/field"
import {
  clearButtonClass,
  inputClass,
  labelTextClass,
  solidButton,
  textAreaClass,
} from "~/ui/styles"

const dividerClass = "border-gray-600"

const store = atom<Character[]>([])
syncStoreWithLiveblocks(
  store,
  (storage) => storage.root.get("characters")?.toArray() ?? [],
  (storage, data) => storage.root.set("characters", new LiveList(data)),
)

function addCharacter() {
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

  store.set([...store.get(), character])

  return character
}

function updateCharacter(id: string, updates: Partial<Omit<Character, "id">>) {
  store.set(
    store
      .get()
      .map((character) =>
        character.id === id ? { ...character, ...updates } : character,
      ),
  )
}

function deleteCharacter(id: string) {
  store.set(store.get().filter((character) => character.id !== id))
}

export default function CharactersPage() {
  const params = useParams<{ id?: string }>()
  const navigate = useNavigate()

  const characters = useStore(store)

  const characterId = params.id
  const currentCharacter =
    characters.find((c) => c.id === characterId) ?? characters[0]

  const createCharacter = () => {
    const character = addCharacter()
    navigate(`/characters/${character.id}`)
  }

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
  return (
    <div className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid content-between gap-4">
          <Field label="Name">
            <input
              type="text"
              placeholder="What should we call you?"
              value={character.name}
              onChange={(e) =>
                updateCharacter(character.id, { name: e.target.value })
              }
              className={inputClass}
            />
          </Field>
          <Field label="Group">
            <input
              type="text"
              placeholder="Whom do you side with?"
              value={character.group}
              onChange={(e) =>
                updateCharacter(character.id, { group: e.target.value })
              }
              className={inputClass}
            />
          </Field>
          <section>
            <h2 className={labelTextClass}>Momentum</h2>
            <div className={clsx(inputClass, "grid place-items-center")}>
              <Counter
                value={character.momentum}
                onChange={(momentum) =>
                  updateCharacter(character.id, { momentum })
                }
              />
            </div>
          </section>
        </div>

        <div className="grid gap-4">
          <Clock
            name="Stress"
            progress={character.stress}
            maxProgress={4}
            onProgressChange={(stress) =>
              updateCharacter(character.id, { stress })
            }
          />
          <Field label="Condition">
            <input
              placeholder="How're you doing?"
              value={character.condition}
              onChange={(e) =>
                updateCharacter(character.id, { condition: e.target.value })
              }
              className={inputClass}
            />
          </Field>
        </div>
      </div>

      <hr className={dividerClass} />

      <section>
        <h3 className={labelTextClass}>Actions</h3>
        <div className="grid gap-4 sm:grid-cols-3">
          {entriesTyped(characterActionLibrary).map(([category, actions]) => (
            <section
              key={category}
              className="flex flex-col rounded-md bg-black/25 p-4"
            >
              <h4 className="font-header mb-4 text-center text-xl leading-tight tracking-wide">
                {category}
              </h4>
              <div className="grid gap-4">
                {actions.map((action) => (
                  <section
                    key={action}
                    className="grid grid-flow-row grid-cols-[1fr,auto] grid-rows-[auto,auto]"
                  >
                    <h5 className={labelTextClass}>{action}</h5>
                    <div className="row-span-2 flex items-end">
                      <ActionRollButton
                        name={character.name}
                        action={action}
                        level={character.actions[action]?.level ?? 0}
                      />
                    </div>
                    <DotCounter
                      value={character.actions[action]?.level ?? 0}
                      max={4}
                      onChange={(level) => {
                        updateCharacter(character.id, {
                          actions: {
                            ...character.actions,
                            [action]: { level },
                          },
                        })
                      }}
                    />
                  </section>
                ))}
              </div>
            </section>
          ))}
        </div>
      </section>

      <hr className={dividerClass} />

      <div className="grid gap-4">
        <Field label="Concept">
          <TextArea
            placeholder="Describe yourself."
            value={character.concept}
            onChange={(e) =>
              updateCharacter(character.id, { concept: e.target.value })
            }
            className={textAreaClass}
          />
        </Field>
        <Field label="Appearance">
          <TextArea
            placeholder="How do you look? What do you like to wear?"
            value={character.appearance}
            onChange={(e) =>
              updateCharacter(character.id, { appearance: e.target.value })
            }
            className={textAreaClass}
          />
        </Field>
        <Field label="Ties">
          <TextArea
            placeholder="Who are your friends and enemies?"
            value={character.ties}
            onChange={(e) =>
              updateCharacter(character.id, { ties: e.target.value })
            }
            className={textAreaClass}
          />
        </Field>
        <Field label="Talents">
          <TextArea
            placeholder="stat buffs stat buffs stat buffs"
            value={character.talents}
            onChange={(e) =>
              updateCharacter(character.id, { talents: e.target.value })
            }
            className={textAreaClass}
          />
        </Field>
      </div>

      <hr className={dividerClass} />

      <section>
        <DeleteButton
          characterId={character.id}
          characterName={character.name}
        />
      </section>
    </div>
  )
}

function ActionRollButton({
  name,
  action,
  level,
}: {
  name: string
  action: string
  level: number
}) {
  return (
    <Button
      type="submit"
      title={`Roll ${action}`}
      className={clearButtonClass(false)}
      onClick={() => {
        setDiceRoll(level + 1, `${name}: ${action}`)
      }}
    >
      <Hexagon />
    </Button>
  )
}

function DeleteButton({
  characterName,
  characterId,
}: {
  characterName: string
  characterId: string
}) {
  const [visible, setVisible] = useState(false)
  const navigate = useNavigate()

  const handleConfirm = () => {
    deleteCharacter(characterId)
    setVisible(false)
    navigate("/characters")
  }

  return (
    <>
      <button className={solidButton} onClick={() => setVisible(true)}>
        <Trash />
        Delete
      </button>
      <Transition.Root show={visible}>
        <Dialog onClose={() => setVisible(false)}>
          <Transition.Child
            enter="transition"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/50" />
          </Transition.Child>

          <div className="pointer-events-none fixed inset-0 flex flex-col">
            <Transition.Child
              enter="transition ease-out duration-300"
              enterFrom="opacity-0 translate-y-4"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-4"
              as={Fragment}
            >
              <Dialog.Panel className="pointer-events-auto m-auto flex flex-col items-center gap-4 rounded-md bg-gray-800 p-4 shadow-md">
                <Dialog.Title>
                  Are you sure you want to delete{" "}
                  {characterName || "this character"}?
                </Dialog.Title>
                <div className="flex items-center gap-4">
                  <button
                    className={solidButton}
                    onClick={() => setVisible(false)}
                  >
                    <X />
                    Cancel
                  </button>
                  <button className={solidButton} onClick={handleConfirm}>
                    <Trash />
                    Delete
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  )
}
