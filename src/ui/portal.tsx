import { useEffect, useState } from "react"
import { createPortal } from "react-dom"

export function Portal({ children }: { children: React.ReactNode }) {
  const [container, setContainer] = useState<HTMLElement>()

  useEffect(() => {
    const element = document.createElement("react-portal")
    document.body.append(element)
    setContainer(element)
    return () => element.remove()
  }, [])

  return container ? createPortal(children, container) : <>{children}</>
}
