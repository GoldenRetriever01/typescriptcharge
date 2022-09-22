import { useTransition } from "@remix-run/react"
import { useLayoutEffect, useRef } from "react"
import { ClientOnly } from "./client-only"

// fetcher actions scroll the page to the top after the redirect,
// and this is a workaround to keep that from happening
export function ActionScrollRestoration() {
  return (
    <ClientOnly>
      <ActionScrollRestorationClient />
    </ClientOnly>
  )
}

function ActionScrollRestorationClient() {
  const scrollBeforeRedirect = useRef<number>()
  const transition = useTransition()

  useLayoutEffect(() => {
    if (transition.type === "fetchActionRedirect") {
      scrollBeforeRedirect.current = window.scrollY
    }
    if (transition.type === "idle" && scrollBeforeRedirect.current) {
      window.scrollTo(0, scrollBeforeRedirect.current)
      scrollBeforeRedirect.current = undefined
    }
  }, [transition])

  return <></>
}
