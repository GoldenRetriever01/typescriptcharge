import { ClientSideSuspense } from "@liveblocks/react"

export function LoadingSpinner() {
  return (
    <div className="grid w-fit animate-spin grid-cols-[1rem,1rem] grid-rows-[1rem,1rem] gap-2">
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
