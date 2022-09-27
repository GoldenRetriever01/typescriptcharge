import type { WritableStore } from "nanostores"
import { atom } from "nanostores"
import { useEffect, useState } from "react"
import type { z } from "zod"
import { useEvent } from "./react"

export type LocalStorageStoreOptions<T> = {
  key: string
  fallback: T
  schema: z.ZodType<T>
}

export function createLocalStorageStore<T>(
  options: LocalStorageStoreOptions<T>,
): WritableStore<T> {
  let initialValue = options.fallback

  if (typeof localStorage !== "undefined") {
    try {
      const raw = localStorage.getItem(options.key)
      if (raw !== null) {
        initialValue = options.schema.parse(JSON.parse(raw))
      }
      // eslint-disable-next-line no-empty
    } catch {}
  }

  const store = atom(initialValue)
  if (typeof localStorage !== "undefined") {
    store.subscribe((value) => {
      localStorage.setItem(
        options.key,
        JSON.stringify(options.schema.parse(value)),
      )
    })
  }

  return store
}

export function useLocalStorage<T>(options: LocalStorageStoreOptions<T>) {
  const [internalValue, setInternalValue] = useState<T>()

  const init = useEvent((key: string) => {
    try {
      const storedValue = localStorage.getItem(key)
      setInternalValue(
        storedValue
          ? options.schema.parse(JSON.parse(storedValue))
          : options.fallback,
      )
    } catch {
      setInternalValue(options.fallback)
    }
  })
  useEffect(() => init(options.key), [init, options.key])

  const setValue = useEvent((value: T) => {
    setInternalValue(value)
    localStorage.setItem(options.key, JSON.stringify(value))
  })

  return [internalValue, setValue] as const
}
