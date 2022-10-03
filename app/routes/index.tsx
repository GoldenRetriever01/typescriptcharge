import TextArea from "react-expanding-textarea"
import { useUpdateWorld, useWorld } from "~/features/world/world-state"
import { Field } from "~/ui/field"
import { inputClass, raisedPanelClass, textAreaClass } from "~/ui/styles"

export default function WorldPage() {
  const world = useWorld()
  const updateWorld = useUpdateWorld()
  return (
    <div className={raisedPanelClass}>
      <div className="grid gap-4 p-4">
        <Field label="Name">
          <input
            placeholder="What is this place?"
            className={inputClass}
            value={world?.name}
            onChange={(e) => updateWorld({ name: e.target.value })}
          />
        </Field>
        <Field label="Description">
          <TextArea
            placeholder="How's the weather?"
            className={textAreaClass}
            value={world?.description}
            onChange={(e) => updateWorld({ description: e.target.value })}
          />
        </Field>
      </div>
    </div>
  )
}
