import { useParams } from "@remix-run/react"
import { CharacterSheet } from "~/features/characters/character-sheet"
import { CardSection } from "~/ui/card-section"
import { LoadingSuspense } from "~/ui/loading"

export default function CharactersPage() {
  const params = useParams<{ id?: string }>()
  return (
    <CardSection>
      <LoadingSuspense>
        <CharacterSheet characterId={params.id} />
      </LoadingSuspense>
    </CardSection>
  )
}
