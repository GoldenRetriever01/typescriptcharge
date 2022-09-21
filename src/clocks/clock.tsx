import clsx from "clsx"
import { MinusCircle, PlusCircle } from "preact-feather"
import { useEffect, useRef, useState } from "preact/hooks"
import { activePress } from "../ui/styles"

export function Clock({
  name,
  ...props
}: {
  name: string
  slices: number
  filledSlices: number
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [slices, setSlices] = useState(props.slices)
  const [filledSlices, setFilledSlices] = useState(props.filledSlices)
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

    let slice = Math.ceil((angle / (2 * Math.PI)) * slices)

    // to ensure we can't turn off a slice
    // then immediately turn it back on when dragging a pixel
    if (slice === lastSliceInput.current) return
    lastSliceInput.current = slice

    // the slice being 0 means we actually filled the chart, due to atan2 math
    if (slice === 0) {
      slice = slices
    }

    // need to be able to turn the current slice off
    if (slice === filledSlices && toggleSlice) {
      slice -= 1
    }

    setFilledSlices(slice)
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
      angleTop + (tau * filledSlices) / slices,
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
    if (slices > 1) {
      context.save()
      context.globalAlpha = 0.75
      context.strokeStyle = color
      context.lineWidth = lineWidth

      for (let i = 0; i < slices; i++) {
        context.beginPath()
        context.moveTo(centerX, centerY)
        context.lineTo(
          centerX +
            (centerX - lineWidth) * Math.cos(angleTop + (tau * i) / slices),
          centerY +
            (centerY - lineWidth) * Math.sin(angleTop + (tau * i) / slices),
        )
        context.stroke()
      }
      context.restore()
    }
  })

  const countButtonClass = clsx("transition hover:text-blue-300", activePress)

  return (
    <div class="flex flex-col gap-4 items-center justify-center bg-black/20 rounded-md p-4 shadow-inner text-center">
      <input
        class="tracking-wide text-xl leading-tight bg-transparent transition hover:bg-black/25 focus:bg-black/25 focus:outline-none text-center w-full p-2 -my-2 rounded-md"
        value={name}
        placeholder="Clock name"
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
          onClick={() => setSlices(Math.max(1, slices - 1))}
        >
          <MinusCircle />
        </button>
        <p class="leading-none tabular-nums min-w-[1.5rem]">{slices}</p>
        <button
          type="button"
          title="Add slice"
          class={countButtonClass}
          onClick={() => setSlices(slices + 1)}
        >
          <PlusCircle />
        </button>
      </div>
    </div>
  )
}
