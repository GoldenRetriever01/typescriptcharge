import { Suspense } from "react"

export function LoadingSpinner() {
  return (
    <div className="grid grid-rows-[1rem,1rem] grid-cols-[1rem,1rem] animate-spin w-fit gap-2">
      <div className="bg-blue-200 rounded-full" />
      <div className="bg-blue-400 rounded-full" />
      <div className="bg-blue-400 rounded-full" />
      <div className="bg-blue-200 rounded-full" />
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
  return <Suspense fallback={<LoadingPlaceholder />}>{children}</Suspense>
}
