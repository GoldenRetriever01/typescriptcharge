import type { ValueOf } from "../../helpers/types"

export const characterActionLibrary = {
  Physique: ["Muscle", "Finesse", "Move", "Sneak"],
  Insight: ["Shoot", "Tinker", "Study", "Notice"],
  Resolve: ["Bond", "Command", "Focus", "Sway"],
} as const

export type CharacterActionName = ValueOf<typeof characterActionLibrary>[number]
