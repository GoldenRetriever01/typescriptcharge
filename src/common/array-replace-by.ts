export const arrayReplaceBy = <T>(
  items: T[],
  replacement: T,
  predicate: (item: T) => boolean,
) => items.map((item) => (predicate(item) ? replacement : item))
