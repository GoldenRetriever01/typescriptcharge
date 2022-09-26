import { useCallback, useEffect, useState } from "react"
import type { z } from "zod"
import { useEvent } from "./react"

export function useLocalStorage<T>(options: {
  key: string
  defaultValue: T
  schema: z.ZodType<T>
}) {
  const [value, setValue] = useState<T>()

  const initValue = useEvent((key: string, schema: z.ZodType<T>) => {
    const storedValue = localStorage.getItem(key)
    try {
      setValue(
        storedValue
          ? schema.parse(JSON.parse(storedValue))
          : options.defaultValue,
      )
    } catch {
      setValue(options.defaultValue)
    }
  })

  useEffect(() => {
    initValue(options.key, options.schema)
  }, [initValue, options.key, options.schema])

  const setItem = useCallback(
    (newValue: T) => {
      setValue(newValue)
      localStorage.setItem(options.key, JSON.stringify(newValue))
    },
    [options.key],
  )

  return [value, setItem] as const
}
