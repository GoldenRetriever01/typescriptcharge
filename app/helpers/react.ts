import type { ForwardedRef, ReactElement, ReactNode } from "react"
import { forwardRef, useCallback, useInsertionEffect, useRef } from "react"

export function useEvent<A extends unknown[], R>(fn: (...args: A) => R) {
  const ref = useRef((...args: A): R => {
    throw new Error("Cannot call event handler while rendering.")
  })

  useInsertionEffect(() => {
    ref.current = fn
  })

  return useCallback((...args: A) => ref.current(...args), [])
}

export function useLatestRef<T>(value: T): { readonly current: T } {
  const ref = useRef(value)
  useInsertionEffect(() => {
    ref.current = value
  })
  return ref
}

export function isRendered(
  value: unknown,
): value is Exclude<ReactNode, undefined | null | boolean> {
  return value != undefined && typeof value !== "boolean"
}

export function autoRef<Props extends object, RefType>(component: {
  (props: Props & { ref?: ForwardedRef<RefType> }): ReactElement
  displayName?: string
}) {
  const AutoRefComponent = forwardRef<RefType, Props>((props, ref) =>
    component({ ...props, ref }),
  )

  AutoRefComponent.displayName = `AutoRef(${
    component.displayName || component.name
  })`

  return AutoRefComponent
}
