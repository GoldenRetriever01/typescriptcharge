import { useEffect } from "react"

export function useWindowEvent<E extends keyof WindowEventMap>(
  type: E,
  listener: (ev: WindowEventMap[E]) => void,
  options?: AddEventListenerOptions,
) {
  useEffect(() => {
    window.addEventListener(type, listener, options)
    return () => window.removeEventListener(type, listener)
  })
}
