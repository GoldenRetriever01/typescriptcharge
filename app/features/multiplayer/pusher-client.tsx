import PusherClient from "pusher-js"
import { createContext, useContext, useEffect, useState } from "react"
import type { PusherEvents } from "./pusher-config"
import { pusherChannel } from "./pusher-config"

const empty = Symbol()

const ClientContext = createContext<PusherClient | undefined | typeof empty>(
  empty,
)

export function PusherProvider(props: {
  pusherKey: string
  pusherCluster: string
  children: React.ReactNode
}) {
  const [client, setClient] = useState<PusherClient>()

  useEffect(() => {
    const client = new PusherClient(props.pusherKey, {
      cluster: props.pusherCluster,
    })
    setClient(client)
    return () => {
      client.disconnect()
    }
  }, [props.pusherCluster, props.pusherKey])

  return (
    <ClientContext.Provider value={client}>
      {props.children}
    </ClientContext.Provider>
  )
}

export function usePusherEvent<E extends keyof PusherEvents>(
  eventName: E,
  callback: (data: PusherEvents[E]) => void,
) {
  const pusher = useContext(ClientContext)
  if (pusher === empty) {
    throw new Error("PusherProvider not found")
  }

  useEffect(() => {
    if (!pusher) return
    const channel = pusher.subscribe(pusherChannel)
    channel.bind(eventName, callback)
    return () => {
      channel.unbind_all().unsubscribe()
    }
  })
}
