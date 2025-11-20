export interface Character {
  id: string
  name: string
  image: string
  tier?: string
  franchise?: string
  weight?: number // Point value based on tier
  stats?: CharacterStats
}

export interface CharacterStats {
  hp: number
  attack: number
  defense: number
  cost: number
}

export type RoleName = 'Captain' | 'Vice Captain' | 'Tank' | 'Healer' | 'Support' | 'Support'

export interface TeamSlot {
  id: string
  role: RoleName
  character: Character | null
}

export type Team = TeamSlot[]
