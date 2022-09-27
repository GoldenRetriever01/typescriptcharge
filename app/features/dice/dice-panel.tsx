import { Transition } from "@headlessui/react"
import { useStore } from "@nanostores/react"
import { useFetcher } from "@remix-run/react"
import clsx from "clsx"
import { Fragment } from "react"
import { Hexagon } from "react-feather"
import { z } from "zod"
import { createLocalStorageStore } from "~/helpers/local-storage"
import { Button } from "~/ui/button"
import { blackCircleIconButtonClass, slideRightTransition } from "~/ui/styles"
import { simpleTransition } from "~/ui/transition"

const visibleStore = createLocalStorageStore({
  key: "dicePanelVisible",
  fallback: false,
  schema: z.boolean(),
})

export function DicePanelButton() {
  return (
    <Button
      type="submit"
      title="Show dice panel"
      className={blackCircleIconButtonClass}
      onClick={() => {
        visibleStore.set(!visibleStore.get())
      }}
    >
      <Hexagon />
    </Button>
  )
}

export function DicePanel() {
  const visible = useStore(visibleStore)
  const fetcher = useFetcher()

  return (
    <Transition
      show={visible}
      as={Fragment}
      {...simpleTransition({
        in: clsx("translate-x-0 opacity-100"),
        out: clsx("translate-x-4 opacity-0"),
      })}
    >
      <div
        className={clsx(
          "rounded-md bg-black/75 p-4",
          slideRightTransition(visible),
        )}
      >
        the
      </div>
    </Transition>
  )

  // return (
  //   <fetcher.Form action="/api/roll" method="post">
  //     the
  //   </fetcher.Form>
  // )
}
