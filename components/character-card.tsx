import { Card } from '@/components/ui/card'
import type { Character } from '@/types/character'
import { getCharacterStats, getRarityColor, getRarityBg } from '@/lib/game-utils'
import { Sword, Shield, Heart } from 'lucide-react'

export interface CharacterCardProps {
    character: Character
    className?: string
    imageClassName?: string
    compact?: boolean
}

export function CharacterCard({ character, className, imageClassName, compact }: CharacterCardProps) {
    const stats = getCharacterStats(character)
    const rarityBorder = getRarityColor(character.tier)
    const rarityBg = getRarityBg(character.tier)

    return (
        <Card
            className={`overflow-hidden p-0 border-2 ${rarityBorder} ${className} group relative transition-all duration-300 hover:scale-105 hover:z-10 hover:shadow-xl`}
            style={{ backgroundColor: '#1a1229' }}
        >
            <div className="relative w-full h-full">
                <img
                    src={character.image || "/placeholder.svg?height=256&width=192"}
                    alt={character.name}
                    className={`w-full h-full object-cover ${imageClassName}`}
                    crossOrigin="anonymous"
                />

                {/* Cost Badge (Top Left) */}
                <div className="absolute top-2 left-2 bg-blue-600 text-white font-black rounded-full w-8 h-8 flex items-center justify-center border-2 border-blue-400 shadow-lg z-10 text-sm">
                    {stats.cost}
                </div>

                {/* Tier Badge (Top Right) */}
                {character.tier && (
                    <div className="absolute top-2 right-2 bg-black/80 text-white font-bold px-2 py-0.5 rounded border border-white/20 text-xs backdrop-blur-sm z-10 shadow-md">
                        {character.tier}
                    </div>
                )}

                {/* Stats Overlay (Bottom) */}
                <div className={`absolute bottom-0 left-0 right-0 p-2 ${rarityBg} backdrop-blur-md border-t border-white/10`}>
                    <div className="text-white font-bold text-sm truncate mb-1 text-shadow-sm">{character.name}</div>

                    {!compact && (
                        <div className="grid grid-cols-3 gap-1 text-[10px]">
                            <div className="flex items-center justify-center gap-1 text-red-300 bg-black/40 rounded px-1 py-0.5">
                                <Sword className="w-3 h-3" />
                                <span>{stats.attack}</span>
                            </div>
                            <div className="flex items-center justify-center gap-1 text-green-300 bg-black/40 rounded px-1 py-0.5">
                                <Heart className="w-3 h-3" />
                                <span>{stats.hp}</span>
                            </div>
                            <div className="flex items-center justify-center gap-1 text-blue-300 bg-black/40 rounded px-1 py-0.5">
                                <Shield className="w-3 h-3" />
                                <span>{stats.defense}</span>
                            </div>
                        </div>
                    )}

                    {/* Compact Overlay just shows name nicely */}
                    {compact && (
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
                    )}
                </div>
            </div>
        </Card>
    )
}
