export function parseUnsignedInt(input: unknown): number {
  const value = Number(input)
  if (Number.isInteger(value) && value >= 0) return value
  throw new Error(`Expected an unsigned integer, got ${input}`)
}
