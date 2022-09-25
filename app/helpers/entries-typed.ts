export const entriesTyped = Object.entries as <T>(
  o: T,
) => Array<[keyof T, T[keyof T]]>
