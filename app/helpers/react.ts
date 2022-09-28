import type { ReactNode } from "react"
import { useCallback, useInsertionEffect, useRef } from "react"

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
