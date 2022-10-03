import type { CharacterActionName } from "./character-actions"

export type Character = {
  id: string
  name: string
  group: string
  concept: string
  appearance: string
  ties: string
  momentum: number
  stress: number
  condition: string
  actions: Partial<Record<CharacterActionName, { level: number }>>
  talents: string
  hidden?: boolean
  color?: string
}
