import type { DiceLogEntryProps } from "~/dice/dice-log-entry"

export const pusherChannel = "events"

type RoomId = string

export type PusherEvents = {
  [K in `new-dice-log:${RoomId}`]: DiceLogEntryProps
}
