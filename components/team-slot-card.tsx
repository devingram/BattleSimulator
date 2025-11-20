import { Card } from '@/components/ui/card'
import type { Character } from '@/types/character'

interface TeamSlotCardProps {
    role: string
    character: Character | null
    onClick?: () => void
    isActive?: boolean
    disabled?: boolean
    className?: string
}

export function TeamSlotCard({
    role,
    character,
    onClick,
    isActive = false,
    disabled = false,
    className = ''
}: TeamSlotCardProps) {
    return (
        <Card
            onClick={disabled ? undefined : onClick}
            className={`w-32 h-32 p-0 transition-all overflow-hidden ${!disabled ? 'cursor-pointer hover:scale-105' : ''
                } ${isActive ? 'ring-2 ring-accent animate-pulse' : ''} ${className}`}
            style={{ backgroundColor: character ? '#1a1229' : '#2d2440' }}
        >
            {character ? (
                <img
                    src={character.image || "/placeholder.svg?height=128&width=128"}
                    alt={character.name}
                    className="w-full h-full object-fill"
                    crossOrigin="anonymous"
                />
            ) : (
                <div className="w-full h-full flex items-center justify-center">
                    <div className="w-12 h-12 rounded-lg" style={{ backgroundColor: '#4a3f5c' }} />
                </div>
            )}
        </Card>
    )
}
