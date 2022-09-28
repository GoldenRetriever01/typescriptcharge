import { useEffect, useState } from "react"
import type { z } from "zod"
import type { JsonSerializable } from "./json"
import { useLatestRef } from "./react"

export type UseLocalStorageOptions<T extends JsonSerializable> = {
  key: string
  fallback: T
  schema: z.ZodType<T>
}

export function useLocalStorage<T>(options: {
  key: string
  fallback: T
  schema: z.ZodType<T>
}) {
  const [internalValue, setInternalValue] = useState(options.fallback)
  const optionsRef = useLatestRef(options)

  useEffect(() => {
    const raw = localStorage.getItem(options.key)
    try {
      setInternalValue(
        raw === null
          ? optionsRef.current.fallback
          : optionsRef.current.schema.parse(JSON.parse(raw)),
      )
    } catch (error) {
      console.warn("Failed to parse local storage value", error, raw)
      setInternalValue(optionsRef.current.fallback)
    }
  }, [options.key, optionsRef])

  const setValue = (value: T) => {
    setInternalValue(value)
    localStorage.setItem(options.key, JSON.stringify(value))
  }

  return [internalValue, setValue] as const
}
