import type { ReactNode } from "react"
import { createContext, useContext } from "react"

const empty = Symbol()

export function createContextWrapper<T, P extends { [key: string]: unknown }>(
  useContextValue: (props: P) => T,
) {
  const Context = createContext<T | typeof empty>(empty)

  function useValue() {
    const value = useContext(Context)
    if (value === empty) {
      throw new Error("useValue must be used within a Provider")
    }
    return value
  }

  function Provider(props: { children: ReactNode } & P) {
    const value = useContextValue(props)
    return <Context.Provider value={value}>{props.children}</Context.Provider>
  }

  return [useValue, Provider] as const
}
