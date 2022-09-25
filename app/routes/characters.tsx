import { CharacterSheet } from "~/features/characters/character-sheet"
import { CardSection } from "~/ui/card-section"
import { LoadingSuspense } from "~/ui/loading"

export default function CharactersPage() {
  return (
    <CardSection>
      <LoadingSuspense>
        <CharacterSheet />
      </LoadingSuspense>
    </CardSection>
  )
}
