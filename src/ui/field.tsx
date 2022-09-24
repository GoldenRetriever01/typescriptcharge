import { labelTextClass } from "./styles"

export function Field({
  label,
  children,
  className,
}: {
  label: React.ReactNode
  children: React.ReactNode
  className?: string
}) {
  return (
    <label className={className}>
      <div className={labelTextClass}>{label}</div>
      {children}
    </label>
  )
}
