import { useEffect } from "react"
import { useEvent } from "./react"

export function useAnimationLoop(callback: (delta: number) => void) {
  const runCallback = useEvent(callback)

  useEffect(() => {
    let running = true

    void (async () => {
      let lastTime = await animationFrame()
      while (running) {
        const time = await animationFrame()
        const delta = (time - lastTime) / 1000
        lastTime = time
        runCallback(delta)
      }
    })()

    return () => {
      running = false
    }
  }, [runCallback])
}

const animationFrame = () => new Promise(requestAnimationFrame)
