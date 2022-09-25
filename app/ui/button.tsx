import type { ComponentPropsWithoutRef, ForwardedRef } from "react"
import { forwardRef } from "react"

export type ButtonProps = ComponentPropsWithoutRef<"button">

export const Button = forwardRef(function Button(
  props: ButtonProps,
  ref: ForwardedRef<HTMLButtonElement>,
) {
  return <button type="button" {...props} ref={ref} />
})
