/** (inclusive) */
export function range(start: number, end: number) {
  const result = []
  for (let i = start; i <= end; i++) {
    result.push(i)
  }
  return result
}
