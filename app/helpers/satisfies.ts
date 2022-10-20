export function satisfies<T>() {
  return <V extends T>(value: V) => value
}
