export class Emitter<T> {
  private listeners = new Set<(value: T) => void>()

  emit(value: T) {
    for (const listener of this.listeners) listener(value)
  }

  subscribe(listener: (value: T) => void) {
    this.listeners.add(listener)
    return () => {
      this.listeners.delete(listener)
    }
  }
}
