import { useState } from "react"
import { useWindowEvent } from "~/helpers/use-window-event"

export function useScroll() {
  const [scrollX, setScrollX] = useState(
    typeof window !== "undefined" ? window.scrollX : 0,
  )
  const [scrollY, setScrollY] = useState(
    typeof window !== "undefined" ? window.scrollY : 0,
  )
  useWindowEvent("scroll", () => {
    setScrollX(window.scrollX)
    setScrollY(window.scrollY)
  })
  return { scrollX, scrollY }
}
