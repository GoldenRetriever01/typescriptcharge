import { useLocation } from "@remix-run/react"
import clsx from "clsx"
import { useScroll } from "~/helpers/use-scroll"
import { useWindowEvent } from "~/helpers/use-window-event"
import { useOthers, useUpdateMyPresence } from "~/features/multiplayer/liveblocks-react"
import { Portal } from "~/ui/portal"

export function LiveCursors({ name }: { name: string }) {
  const others = useOthers()
  const update = useUpdateMyPresence()
  const location = useLocation()

  useWindowEvent("mousemove", (event) => {
    update({
      cursor: {
        x: event.pageX,
        y: event.pageY,
        name,
        route: location.pathname,
      },
    })
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

function Cursor({
  name,
  x,
  y,
  route,
}: {
  name: string
  x: number
  y: number
  route: string
}) {
  const { scrollX, scrollY } = useScroll()
  const location = useLocation()

  return (
    <div
      className={clsx(
        "pointer-events-none fixed flex items-center gap-2 text-gray-200 drop-shadow-md transition duration-[0.25s] ease-out",
        location.pathname === route ? "opacity-100" : "opacity-30",
      )}
      style={{
        transform: `translate(${x}px, ${y}px)`,
        top: -scrollY,
        left: -scrollX,
      }}
    >
      <CursorImage />
      <p>{name}</p>
    </div>
  )
}

function CursorImage() {
  return (
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
  )
}
