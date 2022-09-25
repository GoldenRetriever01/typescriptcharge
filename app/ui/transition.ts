import type { TransitionClasses } from "@headlessui/react"
import clsx from "clsx"

export function simpleTransition(options: {
  base?: string
  in: string
  out: string
}): TransitionClasses {
  return {
    enter: options.base ?? clsx("transition"),
    enterFrom: options.out,
    enterTo: options.in,
    leave: options.base ?? clsx("transition"),
    leaveFrom: options.in,
    leaveTo: options.out,
  }
}
