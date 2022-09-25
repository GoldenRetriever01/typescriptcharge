import TextArea from "react-expanding-textarea"
import type { World } from "~/features/world/world"
import { useMutation, useStorage } from "~/features/multiplayer/liveblocks-react"
import { CardSection } from "~/ui/card-section"
import { Field } from "~/ui/field"
import { LoadingSuspense } from "~/ui/loading"
import { inputClass, textAreaClass } from "~/ui/styles"

export default function WorldPage() {
  return (
    <CardSection>
      <LoadingSuspense>
        <WorldEditor />
      </LoadingSuspense>
    </CardSection>
  )
}

function WorldEditor() {
  const world = useStorage((root) => root.world) ?? {
    name: "New World",
    description: "A brand new world",
  }

  const updateWorld = useMutation(
    (context, updates: Partial<World>) => {
      context.storage.set("world", { ...world, ...updates })
    },
    [world],
  )

  return (
    <>
      <Field label="Name">
        <input
          placeholder="What is this place?"
          className={inputClass}
          value={world.name}
          onChange={(e) => updateWorld({ name: e.target.value })}
        />
      </Field>
      <Field label="Description">
        <TextArea
          placeholder="How's the weather?"
          className={textAreaClass}
          value={world.description}
          onChange={(e) => updateWorld({ description: e.target.value })}
        />
      </Field>
    </>
  )
}
