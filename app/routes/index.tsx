import { useStore } from "@nanostores/react"
import TextArea from "react-expanding-textarea"
import { updateWorld, worldStore } from "~/features/world/world-store"
import { Field } from "~/ui/field"
import { inputClass, textAreaClass } from "~/ui/styles"

export default function WorldPage() {
  const world = useStore(worldStore)
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
