import { useLocation } from "@remix-run/react"
import clsx from "clsx"
import { useScroll } from "~/helpers/use-scroll"
import { useWindowEvent } from "~/helpers/use-window-event"
import { useOthers, useUpdateMyPresence } from "~/multiplayer/liveblocks-react"
import { Portal } from "~/ui/portal"

export function LiveCursors({
  name,
  avatar,
}: {
  name: string
  avatar: string
}) {
  const others = useOthers()
  const update = useUpdateMyPresence()
  const location = useLocation()

  useWindowEvent("mousemove", (event) => {
    update({
      cursor: {
        x: event.pageX,
        y: event.pageY,
        name,
        avatar,
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
  avatar,
}: {
  name: string
  x: number
  y: number
  route: string
  avatar: string
}) {
  const { scrollX, scrollY } = useScroll()
  const location = useLocation()

  return (
    <div
      className={clsx(
        "pointer-events-none fixed text-gray-200 drop-shadow-md transition duration-[0.25s] ease-out",
        location.pathname === route ? "opacity-100" : "opacity-30",
      )}
      style={{
        transform: `translate(${x}px, ${y}px)`,
        top: -scrollY,
        left: -scrollX,
      }}
    >
      <CursorImage />
      <img
        src={avatar}
        alt={`${name}'s avatar`}
        className="mt-[-2px] ml-3 box-border h-8 w-8 rounded-full bg-current"
      />
    </div>
  )
}

function CursorImage() {
  return (
    <svg
      width="11"
      height="16"
      viewBox="0 0 11 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M0 1.70326V14.9194C0 15.7579 0.969932 16.2241 1.6247 15.7002L4.72609 13.2191C4.9034 13.0773 5.12371 13 5.35078 13H9.82578C10.6801 13 11.141 11.9979 10.585 11.3492L1.75926 1.05247C1.15506 0.347567 0 0.774852 0 1.70326Z"
        fill="currentColor"
      />
    </svg>
  )
}
