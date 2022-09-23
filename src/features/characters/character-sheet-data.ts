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
  actions: CharacterAction[]
  talents: string
}

export type CharacterAction = {
  category: string
  name: string
  level: number
}
