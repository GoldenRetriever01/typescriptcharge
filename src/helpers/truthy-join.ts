export function truthyJoin(separator: string, values: unknown[]) {
  return values.filter(Boolean).join(separator)
}
