export function countWhere<T>(array: T[], predicate: (item: T) => boolean) {
  // eslint-disable-next-line unicorn/no-array-reduce
  return array.reduce((count, item) => (predicate(item) ? count + 1 : count), 0)
}
