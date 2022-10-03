import { ClientSideSuspense } from "@liveblocks/react"
import clsx from "clsx"

export function LoadingSpinner({
  size = "medium",
}: {
  size?: "small" | "medium"
}) {
  return (
    <div
      className={clsx(
        "grid w-fit animate-spin",
        size === "small" &&
          "grid-cols-[0.5rem,0.5rem] grid-rows-[0.5rem,0.5rem] gap-1",
        size === "medium" &&
          "grid-cols-[1rem,1rem] grid-rows-[1rem,1rem] gap-2",
      )}
    >
      <div className="rounded-full bg-blue-200" />
      <div className="rounded-full bg-blue-400" />
      <div className="rounded-full bg-blue-400" />
      <div className="rounded-full bg-blue-200" />
    </div>
  )
}

export function LoadingPlaceholder() {
  return (
    <div className="flex justify-center p-8">
      <LoadingSpinner />
    </div>
  )
}

export function LoadingSuspense({ children }: { children: React.ReactNode }) {
  return (
    <ClientSideSuspense fallback={<LoadingPlaceholder />}>
      {() => children}
    </ClientSideSuspense>
  )
}

export function EmptySuspense({ children }: { children: React.ReactNode }) {
  return (
    <ClientSideSuspense fallback={<></>}>{() => children}</ClientSideSuspense>
  )
}
