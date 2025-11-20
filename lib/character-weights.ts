// Character weight/point values based on tier
import { Character, TeamSlot } from '@/types/character'

export const TIER_WEIGHTS: Record<string, number> = {
  'S+': 100,
  'S': 85,
  'S-': 75,
  'A+': 65,
  'A': 55,
  'A-': 50,
  'B+': 45,
  'B': 40,
  'B-': 35,
  'C+': 30,
  'C': 25,
  'C-': 20,
}

export function getCharacterWeight(character: Character): number {
  if (character.weight !== undefined) {
    return character.weight
  }

  if (character.tier && TIER_WEIGHTS[character.tier]) {
    return TIER_WEIGHTS[character.tier]
  }

  // Default weight if no tier specified
  return 40
}

export function calculateTeamWeight(team: TeamSlot[]): number {
  return team.reduce((total, slot) => {
    if (slot.character) {
      return total + getCharacterWeight(slot.character)
    }
    return total
  }, 0)
}
