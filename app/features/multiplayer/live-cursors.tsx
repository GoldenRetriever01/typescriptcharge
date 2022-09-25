import { useState } from "react"
import { useWindowEvent } from "~/helpers/use-window-event"
import { useOthers, useUpdateMyPresence } from "~/liveblocks/react"
import { Portal } from "~/ui/portal"

export function LiveCursors({ name }: { name: string }) {
  const others = useOthers()
  const update = useUpdateMyPresence()

  useWindowEvent("mousemove", (event) => {
    update({ cursor: { x: event.pageX, y: event.pageY, name } })
  })

  return (
    <Portal>
      {others
        .filter((other) => other.presence.cursor)
        .map((other, index) => (
          <Cursor key={other.id ?? index} {...other.presence.cursor!} />
        ))}
    </Portal>
  )
}

function Cursor({ name, x, y }: { name: string; x: number; y: number }) {
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

  return (
    <div
      className="pointer-events-none fixed flex items-center gap-2 text-gray-200 drop-shadow-md transition-transform duration-[0.25s] ease-out"
      style={{
        transform: `translate(${x}px, ${y}px)`,
        top: -scrollY,
        left: -scrollX,
      }}
    >
      <svg
        width="22"
        height="33"
        viewBox="0 0 22 33"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0 32.5V0.5L21.4908 23.4077H9.21033L0 32.5Z"
          fill="currentColor"
        />
      </svg>
      <p>{name}</p>
    </div>
  )
}
