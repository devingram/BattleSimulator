import type { Character } from '@/types/character'
import { getCharactersByFranchise } from './character-database'

export const DEFAULT_CHARACTERS: Character[] = getCharactersByFranchise('one-piece')
