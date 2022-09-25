import { ClockList } from "~/features/clocks/clock-list"
import { CardSection } from "~/ui/card-section"
import { LoadingSuspense } from "~/ui/loading"

export default function CharactersPage() {
  return (
    <CardSection>
      <LoadingSuspense>
        <ClockList />
      </LoadingSuspense>
    </CardSection>
  )
}
