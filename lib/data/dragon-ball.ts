import type { Character } from '@/types/character'

export const DRAGON_BALL_CHARACTERS: Record<string, Character> = {
    'goku': { id: 'db-goku', name: 'Son Goku', image: '/characters/dragon-ball/goku.jpg', tier: 'S+', franchise: 'Dragon Ball' },
    'vegeta': { id: 'db-vegeta', name: 'Vegeta', image: '/characters/dragon-ball/vegeta.jpg', tier: 'S', franchise: 'Dragon Ball' },
    'gohan': { id: 'db-gohan', name: 'Son Gohan', image: '/characters/dragon-ball/gohan.jpg', tier: 'S', franchise: 'Dragon Ball' },
    'frieza': { id: 'db-frieza', name: 'Frieza', image: '/characters/dragon-ball/frieza.jpg', tier: 'S', franchise: 'Dragon Ball' },
    'beerus': { id: 'db-beerus', name: 'Beerus', image: '/characters/dragon-ball/beerus.jpg', tier: 'S+', franchise: 'Dragon Ball' },
    'whis': { id: 'db-whis', name: 'Whis', image: '/characters/dragon-ball/whis.jpg', tier: 'S+', franchise: 'Dragon Ball' },
    'broly': { id: 'db-broly', name: 'Broly', image: '/characters/dragon-ball/broly.jpg', tier: 'S', franchise: 'Dragon Ball' },
    'jiren': { id: 'db-jiren', name: 'Jiren', image: '/characters/dragon-ball/jiren.jpg', tier: 'S', franchise: 'Dragon Ball' },
}
