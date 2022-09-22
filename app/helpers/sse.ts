import type { DataFunctionArgs, SerializeFrom } from "@remix-run/node"
import { useEffect, useState } from "react"
import { useEvent } from "./react"
import type { MaybePromise } from "./types"

export type Unsubscribe = () => void

export type ServerEventsResponse<T> = Response & { __serverEvent: T }

export function serverEvents<T>(
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
  }) as ServerEventsResponse<T>
}

export type AnyServerEventsLoader = (
  args: DataFunctionArgs,
) => MaybePromise<ServerEventsResponse<unknown>>

export type EventSourceData<F extends AnyServerEventsLoader> = SerializeFrom<
  Awaited<ReturnType<F>>["__serverEvent"]
>

export function useEventSource<F extends AnyServerEventsLoader>(
  path: string,
  callback: (data: EventSourceData<F>) => void,
) {
  const handleMessage = useEvent((event: MessageEvent) =>
    callback(JSON.parse(event.data)),
  )
  useEffect(() => {
    const source = new EventSource(path)
    source.addEventListener("message", handleMessage)
    return () => source.close()
  }, [path, handleMessage])
}

export function useEventSourceState<F extends AnyServerEventsLoader>(
  path: string,
  initialState: EventSourceData<F>,
) {
  const [state, setState] = useState(initialState)
  useEventSource(path, setState)
  return state
}
