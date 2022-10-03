import clsx from "clsx"

export type CharacterColorClasses = {
  background: string
  border: string
}

export const characterColors: Record<string, CharacterColorClasses> = {
  gray: {
    background: clsx("bg-gray-700"),
    border: clsx("border-gray-600"),
  },
  red: {
    background: clsx("bg-[#612323]"),
    border: clsx("border-[#782b2b]"),
  },
  orange: {
    background: clsx("bg-[#833f28]"),
    border: clsx("border-[#9c4b2f]"),
  },
  dandelion: {
    background: clsx("bg-[#756c28]"),
    border: clsx("border-[#8a7f2f]"),
  },
  lime: {
    background: clsx("bg-[#334a19]"),
    border: clsx("border-[#415e20]"),
  },
  ocean: {
    background: clsx("bg-[#0d4647]"),
    border: clsx("border-[#105859]"),
  },
  blue: {
    background: clsx("bg-[#1a4378]"),
    border: clsx("border-[#1f5191]"),
  },
  midnight: {
    background: clsx("bg-[#21325e]"),
    border: clsx("border-[#263a6e]"),
  },
  violet: {
    background: clsx("bg-[#4a3170]"),
    border: clsx("border-[#624194]"),
  },
  pink: {
    background: clsx("bg-[#702342]"),
    border: clsx("border-[#872a50]"),
  },
}
