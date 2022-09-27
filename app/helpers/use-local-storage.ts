import { useEffect, useState } from "react"
import type { z } from "zod"
import { useEvent } from "./react"

export type UseLocalStorageOptions<T> = {
  key: string
  fallback: T
  schema: z.ZodType<T>
}

export function useLocalStorage<T>(options: UseLocalStorageOptions<T>) {
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
