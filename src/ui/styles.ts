import clsx from "clsx"

export const activePress = clsx(
  "transition active:translate-y-0.5 active:transition-none",
)

export const solidButton = clsx(
  "bg-black/25 hover:bg-black/40 focus:outline-none focus-visible:ring-2 ring-blue-500 p-3 rounded-md leading-none inline-flex items-center gap-2",
  activePress,
)

export const navLinkClass = (active: boolean) =>
  clsx(
    "text-lg inline-flex uppercase items-center gap-1.5 border-b-2 transition",
    active
      ? "border-current"
      : "opacity-50 border-transparent hover:opacity-75",
  )
