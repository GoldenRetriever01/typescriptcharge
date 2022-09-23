import { useEffect } from "react"
import { useOthers, useUpdateMyPresence } from "./liveblocks"

export function App() {
  const others = useOthers()
  const updateMyPresence = useUpdateMyPresence()

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      updateMyPresence({
        cursor: { x: event.clientX, y: event.clientY },
      })
    }
    window.addEventListener("mousemove", handleMouseMove, { passive: true })
    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
    }
  })

  return (
    <main>
      {others.map(({ id, presence }) => {
        if (!presence.cursor) return
        return <Cursor key={id} {...presence.cursor} />
      })}
    </main>
  )
}

function Cursor({ x, y }: { x: number; y: number }) {
  return (
    <div
      className="fixed w-2 h-2 bg-red-500 rounded-full"
      style={{
        transform: `translate(${x}px, ${y}px)`,
        transition: "transform ease-out 0.2s",
      }}
    />
  )
}
