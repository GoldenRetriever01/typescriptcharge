import type { ReactNode } from "react"
import { createContext, useContext } from "react"

const empty = Symbol()

export function createContextWrapper<T>(useContextValue: () => T) {
  const Context = createContext<T | typeof empty>(empty)

  function useValue() {
    const value = useContext(Context)
    if (value === empty) {
      throw new Error("useValue must be used within a Provider")
    }
    return value
  }

  function Provider({ children }: { children: ReactNode }) {
    const value = useContextValue()
    return <Context.Provider value={value}>{children}</Context.Provider>
  }

  return [useValue, Provider] as const
}
