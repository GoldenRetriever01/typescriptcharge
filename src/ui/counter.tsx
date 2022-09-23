import { MinusCircle, PlusCircle } from "react-feather"
import { clearButtonClass } from "./styles"

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
        className={clearButtonClass(false)}
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
        className={clearButtonClass(false)}
        onClick={() => onChange(Math.min(value + 1, max))}
      >
        <PlusCircle />
      </button>
    </div>
  )
}
