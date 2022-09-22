import { Form, useFetcher, useSubmit, useTransition } from "@remix-run/react"
import clsx from "clsx"
import { useEffect, useRef } from "react"
import { MinusCircle, PlusCircle, X } from "react-feather"
import { activePress } from "~/ui/styles"
import type { ClockState } from "./clock-state"

function clockStateFromPatch(
  formData: FormData,
  baseClock: ClockState,
): ClockState {
  const data = Object.fromEntries(formData)
  return {
    id: (data.id as string | null) || baseClock.id,
    name: (data.name as string | null) || baseClock.name,
    progress: Number(data.progress || baseClock.progress),
    maxProgress: Number(data.maxProgress || baseClock.maxProgress),
  }
}

export function Clock({ clock: clockProp }: { clock: ClockState }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const pointerDownRef = useRef(false)
  const lastSliceInput = useRef<number>()

  const submit = useSubmit()
  const fetcher = useFetcher()
  const transition = useTransition()

  const clock: ClockState =
    transition.submission?.action === "/clocks" &&
    transition.submission.method === "PATCH" &&
    transition.submission.formData.get("id") === clockProp.id
      ? clockStateFromPatch(transition.submission.formData, clockProp)
      : clockProp

  const updateFilledSlices = (
    event: React.PointerEvent,
    { toggleSlice = false } = {},
  ) => {
    const { offsetX, offsetY } = event.nativeEvent
    const { width, height } = canvasRef.current!

    const x = offsetX - width / 2
    const y = offsetY - height / 2

    const angle = Math.atan2(y, x) + Math.PI / 2

    let progress =
      Math.ceil((angle / (2 * Math.PI)) * clock.maxProgress) % clock.maxProgress

    // to ensure we can't turn off a slice
    // then immediately turn it back on when dragging a pixel
    if (progress === lastSliceInput.current) return
    lastSliceInput.current = progress

    // the slice being < 0 means we actually filled the chart, due to atan2 math
    if (progress <= 0) {
      progress += clock.maxProgress
    }

    // need to be able to turn the current slice off
    if (progress === clock.progress && toggleSlice) {
      progress -= 1
    }

    submit(
      { id: clock.id, progress: String(progress) },
      { method: "patch", action: "/clocks" },
    )
  }

  useEffect(() => {
    const canvas = canvasRef.current!
    const context = canvas.getContext("2d")!

    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const lineWidth = 1
    const angleTop = -Math.PI / 2
    const tau = Math.PI * 2
    const color = getComputedStyle(canvas).color

    context.clearRect(0, 0, canvas.width, canvas.height)

    // filled arc
    context.save()
    context.fillStyle = color
    context.globalAlpha = 0.5
    context.beginPath()
    context.arc(
      centerX,
      centerY,
      centerX - lineWidth / 2,
      angleTop,
      angleTop + (tau * clock.progress) / clock.maxProgress,
      false,
    )
    context.lineTo(centerX, centerY)
    context.fill()
    context.restore()

    // outer border
    context.save()
    context.strokeStyle = color
    context.lineWidth = lineWidth
    context.globalAlpha = 0.75
    context.beginPath()
    context.arc(centerX, centerY, centerX - lineWidth, 0, 2 * Math.PI)
    context.stroke()
    context.restore()

    // segments going from inside to outside
    if (clock.maxProgress > 1) {
      context.save()
      context.globalAlpha = 0.75
      context.strokeStyle = color
      context.lineWidth = lineWidth

      for (let i = 0; i < clock.maxProgress; i++) {
        context.beginPath()
        context.moveTo(centerX, centerY)
        context.lineTo(
          centerX +
            (centerX - lineWidth) *
              Math.cos(angleTop + (tau * i) / clock.maxProgress),
          centerY +
            (centerY - lineWidth) *
              Math.sin(angleTop + (tau * i) / clock.maxProgress),
        )
        context.stroke()
      }
      context.restore()
    }
  })

  const countButtonClass = clsx("transition hover:text-blue-300", activePress)

  return (
    <div className="flex flex-col gap-4 items-center justify-center bg-black/20 rounded-md p-4 shadow-inner text-center relative group">
      <input
        className="tracking-wide text-xl leading-tight bg-transparent transition hover:bg-black/25 focus:bg-black/25 focus:outline-none text-center w-full p-2 -my-2 rounded-md"
        placeholder="Clock name"
        defaultValue={clock.name}
        onChange={(event) => {
          fetcher.submit(
            { id: clock.id, name: event.currentTarget.value },
            { method: "patch", action: "/clocks" },
          )
        }}
      />
      <canvas
        ref={canvasRef}
        width={100}
        height={100}
        draggable={false}
        // eslint-disable-next-line react/no-unknown-property
        onPointerDown={(event) => {
          pointerDownRef.current = true
          lastSliceInput.current = undefined
          updateFilledSlices(event, { toggleSlice: true })

          window.addEventListener(
            "pointerup",
            () => {
              pointerDownRef.current = false
            },
            { once: true },
          )
        }}
        // eslint-disable-next-line react/no-unknown-property
        onPointerMove={(event) => {
          if (pointerDownRef.current) updateFilledSlices(event)
        }}
        className="cursor-pointer opacity-75 hover:opacity-100 transition-opacity select-none"
      />
      <div className="flex items-center justify-center gap-4">
        <Form action="/clocks" method="patch">
          <input type="hidden" name="id" value={clock.id} />
          <input
            type="hidden"
            name="maxProgress"
            value={clock.maxProgress - 1}
          />
          <button
            type="submit"
            title="Remove slice"
            className={countButtonClass}
          >
            <MinusCircle />
          </button>
        </Form>
        <p className="leading-none tabular-nums min-w-[1.5rem]">
          {clock.maxProgress}
        </p>
        <Form action="/clocks" method="patch">
          <input type="hidden" name="id" value={clock.id} />
          <input
            type="hidden"
            name="maxProgress"
            value={clock.maxProgress + 1}
          />
          <button type="submit" title="Add slice" className={countButtonClass}>
            <PlusCircle />
          </button>
        </Form>
      </div>
      <Form action="/clocks" method="delete" className="contents">
        <input type="hidden" name="id" value={clock.id} />
        <button
          className={clsx(
            "absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-75 focus:opacity-75 focus:ring-2 focus:outline-none rounded-md ring-blue-500 transition",
            activePress,
          )}
          type="submit"
          title="Remove clock"
        >
          <X />
        </button>
      </Form>
    </div>
  )
}
