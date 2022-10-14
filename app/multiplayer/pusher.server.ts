import Pusher from "pusher"
import { env } from "~/core/env.server"
import type { PusherEvents } from "./pusher-config"
import { pusherChannel } from "./pusher-config"

const pusher = new Pusher({
  appId: env.PUSHER_APP_ID,
  key: env.PUSHER_KEY,
  secret: env.PUSHER_SECRET,
  cluster: env.PUSHER_CLUSTER,
  useTLS: true,
})

export function triggerEvent<E extends keyof PusherEvents>(
  eventName: E,
  data: PusherEvents[E],
) {
  return pusher.trigger(pusherChannel, eventName, data)
}
