import type { Character, CharacterStats } from '@/types/character'

export function getCharacterStats(character: Character): CharacterStats {
    if (character.stats) return character.stats

    // Default stats based on Tier
    switch (character.tier) {
        case 'S+':
            return { hp: 1000, attack: 100, defense: 80, cost: 5 }
        case 'S':
            return { hp: 850, attack: 85, defense: 65, cost: 4 }
        case 'A+':
            return { hp: 700, attack: 70, defense: 55, cost: 3 }
        case 'A':
            return { hp: 600, attack: 60, defense: 45, cost: 3 }
        case 'B+':
            return { hp: 500, attack: 50, defense: 35, cost: 2 }
        case 'B':
            return { hp: 400, attack: 40, defense: 25, cost: 2 }
        case 'C+':
            return { hp: 300, attack: 30, defense: 15, cost: 1 }
        case 'C':
            return { hp: 200, attack: 20, defense: 10, cost: 1 }
        default:
            return { hp: 100, attack: 10, defense: 5, cost: 1 }
    }
}

export function getRarityColor(tier?: string): string {
    switch (tier) {
        case 'S+': return 'border-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.5)]'
        case 'S': return 'border-purple-400 shadow-[0_0_10px_rgba(192,132,252,0.5)]'
        case 'A+': return 'border-red-400'
        case 'A': return 'border-blue-400'
        case 'B+': return 'border-green-400'
        case 'B': return 'border-gray-400'
        default: return 'border-slate-600'
    }
}

export function getRarityBg(tier?: string): string {
    switch (tier) {
        case 'S+': return 'bg-gradient-to-b from-yellow-900/50 to-black'
        case 'S': return 'bg-gradient-to-b from-purple-900/50 to-black'
        case 'A+': return 'bg-gradient-to-b from-red-900/50 to-black'
        case 'A': return 'bg-gradient-to-b from-blue-900/50 to-black'
        case 'B+': return 'bg-gradient-to-b from-green-900/50 to-black'
        default: return 'bg-slate-900'
    }
}
