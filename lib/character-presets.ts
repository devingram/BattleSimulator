import type { Character } from '@/types/character'
import { CHARACTER_PRESETS } from './character-database'
import type { CharacterPreset } from './character-database'

// Re-export for backwards compatibility

export const ONE_PIECE_TOP_50: Character[] = [
  // Top Tier (S+)
  { id: 'op1', name: 'Monkey D. Luffy (Gear 5)', image: '/luffy-gear-5.jpg', tier: 'S+', franchise: 'One Piece' },
  { id: 'op2', name: 'Kaido', image: '/kaido-one-piece.jpg', tier: 'S+', franchise: 'One Piece' },
  { id: 'op3', name: 'Shanks', image: '/shanks-red-hair.jpg', tier: 'S+', franchise: 'One Piece' },
  { id: 'op4', name: 'Mihawk', image: '/mihawk-one-piece.jpg', tier: 'S+', franchise: 'One Piece' },
  { id: 'op5', name: 'Blackbeard', image: '/blackbeard-marshall-d-teach.jpg', tier: 'S+', franchise: 'One Piece' },
  
  // S Tier
  { id: 'op6', name: 'Big Mom', image: '/big-mom-charlotte-linlin.jpg', tier: 'S', franchise: 'One Piece' },
  { id: 'op7', name: 'Akainu', image: '/akainu-sakazuki.jpg', tier: 'S', franchise: 'One Piece' },
  { id: 'op8', name: 'Dragon', image: '/monkey-d-dragon.jpg', tier: 'S', franchise: 'One Piece' },
  { id: 'op9', name: 'Kizaru', image: '/kizaru-borsalino.jpg', tier: 'S', franchise: 'One Piece' },
  { id: 'op10', name: 'Aokiji', image: '/aokiji-kuzan.jpg', tier: 'S', franchise: 'One Piece' },
  
  // A+ Tier
  { id: 'op11', name: 'Roronoa Zoro', image: '/zoro-one-piece.jpg', tier: 'A+', franchise: 'One Piece' },
  { id: 'op12', name: 'Trafalgar Law', image: '/trafalgar-law.jpg', tier: 'A+', franchise: 'One Piece' },
  { id: 'op13', name: 'Sabo', image: '/sabo-one-piece.jpg', tier: 'A+', franchise: 'One Piece' },
  { id: 'op14', name: 'Marco', image: '/marco-phoenix-one-piece.jpg', tier: 'A+', franchise: 'One Piece' },
  { id: 'op15', name: 'Yamato', image: '/yamato-one-piece.jpg', tier: 'A+', franchise: 'One Piece' },
  { id: 'op16', name: 'King', image: '/placeholder.svg?height=400&width=400', tier: 'A+', franchise: 'One Piece' },
  { id: 'op17', name: 'Katakuri', image: '/placeholder.svg?height=400&width=400', tier: 'A+', franchise: 'One Piece' },
  { id: 'op18', name: 'Ben Beckman', image: '/placeholder.svg?height=400&width=400', tier: 'A+', franchise: 'One Piece' },
  
  // A Tier
  { id: 'op19', name: 'Sanji', image: '/placeholder.svg?height=400&width=400', tier: 'A', franchise: 'One Piece' },
  { id: 'op20', name: 'Boa Hancock', image: '/placeholder.svg?height=400&width=400', tier: 'A', franchise: 'One Piece' },
  { id: 'op21', name: 'Doflamingo', image: '/placeholder.svg?height=400&width=400', tier: 'A', franchise: 'One Piece' },
  { id: 'op22', name: 'Eustass Kid', image: '/placeholder.svg?height=400&width=400', tier: 'A', franchise: 'One Piece' },
  { id: 'op23', name: 'Queen', image: '/placeholder.svg?height=400&width=400', tier: 'A', franchise: 'One Piece' },
  { id: 'op24', name: 'Jinbe', image: '/placeholder.svg?height=400&width=400', tier: 'A', franchise: 'One Piece' },
  { id: 'op25', name: 'Crocodile', image: '/placeholder.svg?height=400&width=400', tier: 'A', franchise: 'One Piece' },
  { id: 'op26', name: 'Ace', image: '/placeholder.svg?height=400&width=400', tier: 'A', franchise: 'One Piece' },
  { id: 'op27', name: 'Fujitora', image: '/placeholder.svg?height=400&width=400', tier: 'A', franchise: 'One Piece' },
  { id: 'op28', name: 'Garp', image: '/placeholder.svg?height=400&width=400', tier: 'A', franchise: 'One Piece' },
  
  // B+ Tier
  { id: 'op29', name: 'Smoker', image: '/placeholder.svg?height=400&width=400', tier: 'B+', franchise: 'One Piece' },
  { id: 'op30', name: 'Jack', image: '/placeholder.svg?height=400&width=400', tier: 'B+', franchise: 'One Piece' },
  { id: 'op31', name: 'Cracker', image: '/placeholder.svg?height=400&width=400', tier: 'B+', franchise: 'One Piece' },
  { id: 'op32', name: 'Perospero', image: '/placeholder.svg?height=400&width=400', tier: 'B+', franchise: 'One Piece' },
  { id: 'op33', name: 'Killer', image: '/placeholder.svg?height=400&width=400', tier: 'B+', franchise: 'One Piece' },
  { id: 'op34', name: 'X Drake', image: '/placeholder.svg?height=400&width=400', tier: 'B+', franchise: 'One Piece' },
  
  // B Tier
  { id: 'op35', name: 'Franky', image: '/placeholder.svg?height=400&width=400', tier: 'B', franchise: 'One Piece' },
  { id: 'op36', name: 'Robin', image: '/placeholder.svg?height=400&width=400', tier: 'B', franchise: 'One Piece' },
  { id: 'op37', name: 'Brook', image: '/placeholder.svg?height=400&width=400', tier: 'B', franchise: 'One Piece' },
  { id: 'op38', name: 'Vergo', image: '/placeholder.svg?height=400&width=400', tier: 'B', franchise: 'One Piece' },
  { id: 'op39', name: 'Pica', image: '/placeholder.svg?height=400&width=400', tier: 'B', franchise: 'One Piece' },
  { id: 'op40', name: 'Magellan', image: '/placeholder.svg?height=400&width=400', tier: 'B', franchise: 'One Piece' },
  { id: 'op41', name: 'Bartholomew Kuma', image: '/placeholder.svg?height=400&width=400', tier: 'B', franchise: 'One Piece' },
  { id: 'op42', name: 'Sentomaru', image: '/placeholder.svg?height=400&width=400', tier: 'B', franchise: 'One Piece' },
  
  // C+ Tier
  { id: 'op43', name: 'Chopper', image: '/placeholder.svg?height=400&width=400', tier: 'C+', franchise: 'One Piece' },
  { id: 'op44', name: 'Nami', image: '/placeholder.svg?height=400&width=400', tier: 'C+', franchise: 'One Piece' },
  { id: 'op45', name: 'Ussop', image: '/placeholder.svg?height=400&width=400', tier: 'C+', franchise: 'One Piece' },
  { id: 'op46', name: 'Caesar Clown', image: '/placeholder.svg?height=400&width=400', tier: 'C+', franchise: 'One Piece' },
  { id: 'op47', name: 'Caribou', image: '/placeholder.svg?height=400&width=400', tier: 'C+', franchise: 'One Piece' },
  { id: 'op48', name: 'Wyper', image: '/placeholder.svg?height=400&width=400', tier: 'C+', franchise: 'One Piece' },
  { id: 'op49', name: 'Paulie', image: '/placeholder.svg?height=400&width=400', tier: 'C+', franchise: 'One Piece' },
  { id: 'op50', name: 'Blueno', image: '/placeholder.svg?height=400&width=400', tier: 'C+', franchise: 'One Piece' }
]

export { CHARACTER_PRESETS }
