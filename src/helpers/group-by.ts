export function groupBy<T, C extends PropertyKey>(
  list: readonly T[],
  key: (item: T) => C,
): Record<C, T[]> {
  const groups: Record<C, T[]> = {} as any
  for (const item of list) {
    const group = key(item)
    ;(groups[group] ??= []).push(item)
  }
  return groups
}
