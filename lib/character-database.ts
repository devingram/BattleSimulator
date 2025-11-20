import type { Character } from '@/types/character'

// Centralized character database organized by franchise
import { ONE_PIECE_CHARACTERS } from './data/one-piece'
import { DRAGON_BALL_CHARACTERS } from './data/dragon-ball'
import { NARUTO_CHARACTERS } from './data/naruto'
import { BLEACH_CHARACTERS } from './data/bleach'
import { MHA_CHARACTERS } from './data/my-hero-academia'

// Centralized character database organized by franchise
export const CHARACTER_DATABASE = {
  'one-piece': ONE_PIECE_CHARACTERS,
  'dragon-ball': DRAGON_BALL_CHARACTERS,
  'naruto': NARUTO_CHARACTERS,
  'bleach': BLEACH_CHARACTERS,
  'my-hero-academia': MHA_CHARACTERS,
} as const

// Helper functions to work with the database
export function getAllCharacters(): Character[] {
  const allChars: Character[] = []
  Object.values(CHARACTER_DATABASE).forEach(franchise => {
    Object.values(franchise).forEach(char => {
      allChars.push(char)
    })
  })
  return allChars
}

export function getCharactersByFranchise(franchise: keyof typeof CHARACTER_DATABASE): Character[] {
  return Object.values(CHARACTER_DATABASE[franchise])
}

export function getCharactersByTier(tier: string): Character[] {
  return getAllCharacters().filter(char => char.tier === tier)
}

export function getCharacterById(id: string): Character | undefined {
  return getAllCharacters().find(char => char.id === id)
}

// Character presets built from the database
export interface CharacterPreset {
  id: string
  name: string
  description: string
  characters: Character[]
}

export const CHARACTER_PRESETS: CharacterPreset[] = [
  {
    id: 'one-piece-top-50',
    name: 'One Piece Top 50',
    description: 'The 50 strongest characters from One Piece, ranked by power level',
    characters: getCharactersByFranchise('one-piece')
  },
  {
    id: 'dragon-ball-legends',
    name: 'Dragon Ball Legends',
    description: 'The most powerful warriors from Dragon Ball series',
    characters: getCharactersByFranchise('dragon-ball')
  },
  {
    id: 'naruto-shinobi',
    name: 'Naruto Shinobi',
    description: 'Elite ninja from the Hidden Leaf and beyond',
    characters: getCharactersByFranchise('naruto')
  },
  {
    id: 'bleach-soul-reapers',
    name: 'Bleach Soul Reapers',
    description: 'The strongest Soul Reapers from Soul Society',
    characters: getCharactersByFranchise('bleach')
  },
  {
    id: 'mha-heroes',
    name: 'My Hero Academia Heroes',
    description: 'Pro Heroes and students from UA High',
    characters: getCharactersByFranchise('my-hero-academia')
  },
  {
    id: 'all-anime-mix',
    name: 'Cross-Anime Mix',
    description: 'A diverse roster from multiple anime franchises',
    characters: [
      ...getCharactersByFranchise('one-piece').slice(0, 10),
      ...getCharactersByFranchise('dragon-ball').slice(0, 5),
      ...getCharactersByFranchise('naruto').slice(0, 5),
      ...getCharactersByFranchise('bleach').slice(0, 3),
      ...getCharactersByFranchise('my-hero-academia').slice(0, 3),
    ]
  }
]
