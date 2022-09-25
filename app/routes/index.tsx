import TextArea from "react-expanding-textarea"
import {
  useMutation,
  useStorage,
} from "~/features/multiplayer/liveblocks-react"
import type { World } from "~/features/world/world"
import { Field } from "~/ui/field"
import { inputClass, textAreaClass } from "~/ui/styles"

export default function WorldPage() {
  return <WorldEditor />
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
