import { Button } from "ariakit/button"
import {
  Popover,
  PopoverArrow,
  PopoverDisclosure,
  usePopoverState,
} from "ariakit/popover"
import clsx from "clsx"
import { Palette } from "lucide-react"
import { activePress, solidButton } from "~/ui/styles"
import { characterColors } from "./character-colors"
import type { Character } from "./character-sheet-data"
import { useUpdateCharacter } from "./hooks"

export function CharacterColorButton({ character }: { character: Character }) {
  const popover = usePopoverState({
    placement: "top-start",
    animated: true,
  })

  const updateCharacter = useUpdateCharacter(character.id)

  return (
    <>
      <PopoverDisclosure state={popover} className={solidButton}>
        <Palette /> Color
      </PopoverDisclosure>
      <Popover
        state={popover}
        className={clsx(
          "w-80 origin-bottom-left scale-90 rounded-md bg-black/50 p-4 opacity-0 transition [&[data-enter]]:scale-100 [&[data-enter]]:opacity-100",
        )}
      >
        <PopoverArrow className="[&_path]:fill-black/50 [&_path]:stroke-black/50" />
        <div className="grid auto-rows-[2rem] grid-cols-5 gap-2">
          {Object.entries(characterColors).map(([name, classes]) => (
            <Button
              key={name}
              className={clsx(
                classes.background,
                "rounded-md ring-2 ring-transparent brightness-150 transition hover:brightness-100 focus:outline-none focus-visible:ring-blue-500",
                activePress,
              )}
              onClick={() => updateCharacter({ color: name })}
            />
          ))}
        </div>
      </Popover>
    </>
  )
}
