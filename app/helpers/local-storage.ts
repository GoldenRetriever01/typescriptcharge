import type { WritableStore } from "nanostores"
import { atom } from "nanostores"
import { z } from "zod"
import type { JsonSerializable } from "./json"

export type LocalStorageStoreOptions<T extends JsonSerializable> = {
  key: string
  fallback: T
  schema: z.ZodType<T>
}

export function createLocalStorageStore<T extends JsonSerializable>(
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

export function createLocalStorageToggleStore(key: string, fallback = false) {
  return createLocalStorageStore({
    key,
    fallback,
    schema: z.boolean(),
  })
}
