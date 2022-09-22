export type Unsubscribe = () => void

export function sse<T>(
  request: Request,
  init: (emit: (event: T) => void) => Unsubscribe | undefined | void,
) {
  const stream = new ReadableStream({
    start(controller) {
      if (request.signal.aborted) return

      const unsubscribe = init((event) => {
        controller.enqueue(`data: ${JSON.stringify(event)}\n\n`)
      })
      request.signal.addEventListener("abort", () => unsubscribe?.())
    },
  })

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
    },
  })
}
