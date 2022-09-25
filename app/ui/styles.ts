import clsx from "clsx"

export const activePress = clsx(
  "transition active:translate-y-0.5 active:transition-none",
)

export const solidButton = clsx(
  "inline-flex items-center gap-2 rounded-md bg-black/25 p-3 leading-none ring-blue-500 hover:bg-black/40 focus:outline-none focus-visible:ring-2",
  activePress,
)

export const clearButtonClass = (active: boolean) =>
  clsx(
    "inline-flex items-center gap-1.5 border-b-2 text-lg uppercase transition",
    activePress,
    active
      ? "border-current"
      : "border-transparent opacity-50 hover:opacity-75",
  )

export const inputBaseClass = clsx(
  "block w-full resize-none rounded-md bg-black/25 transition focus:bg-black/50 focus:outline-none focus:ring-2 focus:ring-blue-500",
)

export const inputClass = clsx(inputBaseClass, "h-12 px-3 leading-none")

export const textAreaClass = clsx(inputBaseClass, "p-3")

export const labelTextClass = clsx("mb-1.5 text-sm font-medium leading-none")

// eslint-disable-next-line tailwindcss/no-contradicting-classname
export const raisedPanelClass = clsx(
  "grid gap-4 border-2 border-gray-600 bg-gray-700 shadow-md shadow-[rgba(0,0,0,0.25)]",
)
