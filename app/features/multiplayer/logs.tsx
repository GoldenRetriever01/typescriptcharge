import { autoUpdate, offset, size, useFloating } from "@floating-ui/react-dom"
import { Transition } from "@headlessui/react"
import { Disclosure, DisclosureContent, useDisclosureState } from "ariakit"
import clsx from "clsx"
import { Fragment } from "react"
import { List, X } from "react-feather"
import { z } from "zod"
import { useLocalStorage } from "~/helpers/use-local-storage"
import { Portal } from "~/ui/portal"
import { activePress, raisedPanelClass } from "~/ui/styles"
import { simpleTransition } from "~/ui/transition"

export function LogsButton() {
  const [visible, setVisible] = useLocalStorage({
    key: "multiplayer-logs-visible",
    defaultValue: false,
    schema: z.boolean(),
  })

  const disclosure = useDisclosureState({
    open: visible,
    setOpen: setVisible,
    animated: true,
  })

  const floating = useFloating({
    placement: "top-start",
    strategy: "fixed", // fixed positioning causes less shifting while scrolling
    middleware: [
      offset(16),
      size({
        padding: 16,
        apply: ({ elements, availableWidth, availableHeight }) => {
          elements.floating.style.width = `${availableWidth}px`
          elements.floating.style.height = `${availableHeight}px`
        },
      }),
    ],
    whileElementsMounted: autoUpdate,
  })

  return (
    <>
      <Disclosure
        state={disclosure}
        type="button"
        title="View logs"
        className={clsx(
          "rounded-full bg-black/25 p-3 transition hover:bg-black/50",
          activePress,
        )}
        ref={floating.reference}
      >
        <List />
      </Disclosure>

      <Transition.Root show={visible ?? false}>
        <Portal>
          <div
            className="max-w-sm gap-2"
            ref={floating.floating}
            style={{
              position: floating.strategy,
              left: floating.x ?? undefined,
              top: floating.y ?? undefined,
            }}
          >
            <Transition.Child
              as={Fragment}
              {...simpleTransition({
                base: clsx("origin-bottom-left transition"),
                in: clsx("scale-100 opacity-100"),
                out: clsx("scale-90 opacity-0"),
              })}
            >
              <div className="flex h-full items-start gap-2">
                <DisclosureContent
                  state={disclosure}
                  as="ul"
                  className={clsx(
                    raisedPanelClass,
                    "flex h-full w-full flex-col justify-end gap-2 overflow-y-auto p-2",
                  )}
                >
                  <li className="rounded-md bg-black/25 px-3 py-2">
                    Duis ea amet quis est elit consectetur deserunt officia
                    reprehenderit laboris voluptate cupidatat veniam nisi.
                    Cupidatat cillum fugiat tempor est anim est eu nulla
                    reprehenderit est. Magna incididunt sit sunt in ut qui
                    fugiat cupidatat eu. Consectetur ex sint consequat voluptate
                    consequat adipisicing reprehenderit est reprehenderit irure
                    duis aliqua nostrud eu.
                  </li>
                  <li className="rounded-md bg-black/25 px-3 py-2">
                    Lorem ut amet veniam magna ullamco aliqua ex sit aute non
                    sunt sit ea sunt. Occaecat non sint aute mollit occaecat
                    quis eu enim fugiat pariatur pariatur cillum. Amet sint est
                    ut consectetur occaecat consectetur ea sint aliqua proident
                    veniam non. Laborum adipisicing laborum amet tempor enim
                    culpa minim dolor cupidatat proident amet deserunt. Irure
                    dolor ad irure nisi officia dolore incididunt minim ex do
                    commodo incididunt ad sunt. Tempor dolor consectetur Lorem
                    fugiat est laborum et enim laboris ex occaecat. Magna qui
                    exercitation consectetur qui ullamco esse.
                  </li>
                  <li className="rounded-md bg-black/25 px-3 py-2">
                    Mollit ad in nisi non consectetur fugiat anim ipsum ex.
                    Aliquip tempor cillum velit sunt tempor anim fugiat. Amet id
                    irure adipisicing ut esse sit incididunt reprehenderit
                    aliquip sit exercitation. Enim nostrud in esse eu labore
                    elit amet voluptate proident in ut id amet. Id aute deserunt
                    excepteur minim id consequat. Officia consequat voluptate
                    consequat voluptate aliquip ex ipsum est.
                  </li>
                </DisclosureContent>
                <Disclosure
                  state={disclosure}
                  className="opacity-75 transition hover:opacity-100"
                >
                  <X />
                </Disclosure>
              </div>
            </Transition.Child>
          </div>
        </Portal>
      </Transition.Root>
    </>
  )
}
