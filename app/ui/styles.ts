import clsx from "clsx"

export const maxWidthContainerClass = clsx(
  "mx-auto w-full max-w-screen-md px-4",
)

export const activePressClass = clsx(
  "transition active:translate-y-0.5 active:transition-none",
)

export const solidButtonClass = clsx(
  "inline-flex items-center gap-2 rounded-md bg-black/25 p-3 leading-none ring-blue-500 hover:bg-black/40 focus:outline-none focus-visible:ring-2",
  activePressClass,
)

export const clearButtonClass = clsx(
  "-m-3 inline-flex items-center gap-1.5 p-3 text-lg uppercase leading-none opacity-50 transition hover:opacity-100",
)

export const navLinkClass = ({ isActive = false } = {}) =>
  clsx(
    "inline-flex items-center gap-1.5 border-b-2 text-lg uppercase transition",
    activePressClass,
    isActive
      ? "border-current"
      : "border-transparent opacity-50 hover:opacity-75",
  )

export const blackCircleIconButtonClass = clsx(
  "rounded-full bg-black/25 p-3 transition hover:bg-black/50 focus:outline-none focus:ring-2 focus:ring-blue-500",
  activePressClass,
)

export const inputBaseClass = clsx(
  "block w-full resize-none rounded-md bg-black/25 transition focus:bg-black/50 focus:outline-none focus:ring-2 focus:ring-blue-500",
)

export const inputClass = clsx(
  inputBaseClass,
  "inline-flex min-h-[3rem] flex-wrap items-center p-3 leading-tight",
)

export const textAreaClass = clsx(inputBaseClass, "p-3")

export const labelTextClass = clsx("mb-1.5 text-sm font-medium leading-none")

// eslint-disable-next-line tailwindcss/no-contradicting-classname
export const raisedPanelClass = clsx(
  "border-2 border-gray-600 bg-gray-700 shadow-md shadow-[rgba(0,0,0,0.25)]",
)

export const slideRightTransition = (visible: boolean) =>
  clsx(
    "transition-all",
    visible ? "visible opacity-100" : "invisible translate-x-4 opacity-0",
  )
