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
