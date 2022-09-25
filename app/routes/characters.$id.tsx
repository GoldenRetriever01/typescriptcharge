import { useParams } from "@remix-run/react"
import { CharacterSheet } from "~/features/characters/character-sheet"

export default function CharactersPage() {
  const params = useParams<{ id?: string }>()
  return <CharacterSheet characterId={params.id} />
}
