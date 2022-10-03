import { LiveList } from "@liveblocks/client"
import type { Character } from "~/features/characters/character-sheet-data"
import {
  useMutation,
  useStorage,
} from "~/features/multiplayer/liveblocks-react"
import { useLiveblocksStorageContext } from "../multiplayer/liveblocks-storage"

export function useCharacters() {
  const storage = useLiveblocksStorageContext()
  return (
    useStorage((root) => root.characters) ?? storage.data.characters?.data ?? []
  )
}

export function useUpdateCharacter(id: string) {
  return useMutation(
    (context, updates: Partial<Omit<Character, "id">>) => {
      const characters = context.storage.get("characters") ?? []
      context.storage.set(
        "characters",
        new LiveList(
          characters.map((character) =>
            character.id === id ? { ...character, ...updates } : character,
          ),
        ),
      )
    },
    [id],
  )
}

export function useDeleteCharacter(id: string) {
  return useMutation(
    (context) => {
      const characters = context.storage.get("characters") ?? []
      context.storage.set(
        "characters",
        new LiveList(characters.filter((character) => character.id !== id)),
      )
    },
    [id],
  )
}

export function useAddCharacter() {
  return useMutation((context) => {
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

    const characters = context.storage.get("characters") ?? []
    context.storage.set("characters", new LiveList([...characters, character]))

    return character
  }, [])
}
