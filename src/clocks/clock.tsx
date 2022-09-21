import clsx from "clsx"
import { MinusCircle, PlusCircle, X } from "preact-feather"
import { useEffect, useRef } from "preact/hooks"
import { activePress } from "../ui/styles"
import type { ClockState } from "./clock-state"

export function Clock({
  clock,
  onChange,
  onRemove,
}: {
  clock: ClockState
  onChange: (clock: ClockState) => void
  onRemove: () => void
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const pointerDownRef = useRef(false)
  const lastSliceInput = useRef<number>()

  const updateFilledSlices = (
    event: PointerEvent,
    { toggleSlice = false } = {},
  ) => {
    const { offsetX, offsetY } = event
    const { width, height } = canvasRef.current!

    const x = offsetX - width / 2
    const y = offsetY - height / 2

    const angle = Math.atan2(y, x) + Math.PI / 2

    let progress = Math.ceil((angle / (2 * Math.PI)) * clock.maxProgress)

    // to ensure we can't turn off a slice
    // then immediately turn it back on when dragging a pixel
    if (progress === lastSliceInput.current) return
    lastSliceInput.current = progress

    // the slice being 0 means we actually filled the chart, due to atan2 math
    if (progress === 0) {
      progress = clock.maxProgress
    }

    // need to be able to turn the current slice off
    if (progress === clock.progress && toggleSlice) {
      progress -= 1
    }

    onChange({ ...clock, progress })
  }

  const updateMaxProgress = (delta: number) => {
    onChange({ ...clock, maxProgress: clock.maxProgress + delta })
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
    <div class="flex flex-col gap-4 items-center justify-center bg-black/20 rounded-md p-4 shadow-inner text-center relative group">
      <input
        class="tracking-wide text-xl leading-tight bg-transparent transition hover:bg-black/25 focus:bg-black/25 focus:outline-none text-center w-full p-2 -my-2 rounded-md"
        placeholder="Clock name"
        value={clock.name}
        onInput={(event) => {
          onChange({ ...clock, name: event.currentTarget.value })
        }}
      />
      <canvas
        ref={canvasRef}
        width={100}
        height={100}
        draggable={false}
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
        onPointerMove={(event) => {
          if (pointerDownRef.current) updateFilledSlices(event)
        }}
        class="cursor-pointer opacity-75 hover:opacity-100 transition-opacity select-none"
      />
      <div class="flex items-center justify-center gap-4">
        <button
          type="button"
          title="Remove slice"
          class={countButtonClass}
          onClick={() => updateMaxProgress(-1)}
        >
          <MinusCircle />
        </button>
        <p class="leading-none tabular-nums min-w-[1.5rem]">
          {clock.maxProgress}
        </p>
        <button
          type="button"
          title="Add slice"
          class={countButtonClass}
          onClick={() => updateMaxProgress(1)}
        >
          <PlusCircle />
        </button>
      </div>
      <button
        class={clsx(
          "absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-75 focus:opacity-75 focus:ring-2 focus:outline-none rounded-md ring-blue-500 transition",
          activePress,
        )}
        type="button"
        title="Remove clock"
        onClick={() => onRemove()}
      >
        <X />
      </button>
    </div>
  )
}
