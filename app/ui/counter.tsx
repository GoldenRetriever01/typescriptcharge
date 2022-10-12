import clsx from "clsx"
import { MinusCircle, PlusCircle } from "lucide-react"
import { range } from "../helpers/range"
import { activePressClass, clearButtonClass } from "./styles"

export function Counter({
  value,
  min = 0,
  max = Number.POSITIVE_INFINITY,
  onChange,
}: {
  value: number
  min?: number
  max?: number
  onChange: (value: number) => void
}) {
  return (
    <div className="flex items-center justify-center gap-2">
      <button
        type="button"
        title="Remove slice"
        className={clearButtonClass}
        onClick={() => onChange(Math.max(value - 1, min))}
      >
        <MinusCircle />
      </button>

      <p className="min-w-[1.5rem] text-center tabular-nums leading-none">
        {value}
      </p>

      <button
        type="button"
        title="Add slice"
        className={clearButtonClass}
        onClick={() => onChange(Math.min(value + 1, max))}
      >
        <PlusCircle />
      </button>
    </div>
  )
}

export function DotCounter({
  value,
  max,
  onChange,
}: {
  value: number
  max: number
  onChange: (value: number) => void
}) {
  return (
    <div className="flex items-center gap-2">
      {range(1, max).map((n) => (
        <button
          key={n}
          type="button"
          title={value === n ? `Set to ${n - 1}` : `Set to ${n}`}
          onClick={() => onChange(value === n ? n - 1 : n)}
          className={clsx(
            "h-5 w-5 rounded-full border-2",
            n <= value ? "bg-white" : "opacity-50",
            activePressClass,
          )}
        />
      ))}
    </div>
  )
}
