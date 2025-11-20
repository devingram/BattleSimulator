'use client'

import { useState } from 'react'
import { Character } from '@/types/character'
import { ONE_PIECE_CHARACTERS } from '@/lib/data/one-piece'
import { DRAGON_BALL_CHARACTERS } from '@/lib/data/dragon-ball'
import { NARUTO_CHARACTERS } from '@/lib/data/naruto'
import { BLEACH_CHARACTERS } from '@/lib/data/bleach'
import { MHA_CHARACTERS } from '@/lib/data/my-hero-academia'
import { CharacterCard } from './character-card'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { getStatsForCharacter } from '@/lib/battle-engine'

// Combine all characters
const ALL_CHARACTERS = [
    ...Object.values(ONE_PIECE_CHARACTERS),
    ...Object.values(DRAGON_BALL_CHARACTERS),
    ...Object.values(NARUTO_CHARACTERS),
    ...Object.values(BLEACH_CHARACTERS),
    ...Object.values(MHA_CHARACTERS),
]

interface DeckBuilderProps {
    onDeckComplete: (deck: Character[]) => void
    isWaiting?: boolean
}

import { ArrowUpDown } from 'lucide-react'

// ... (imports)

export function DeckBuilder({ onDeckComplete, isWaiting = false }: DeckBuilderProps) {
    const [deck, setDeck] = useState<Character[]>([])
    const [activeTab, setActiveTab] = useState('all')
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

    const toggleCharacter = (char: Character) => {
        if (deck.find(c => c.id === char.id)) {
            setDeck(deck.filter(c => c.id !== char.id))
        } else {
            if (deck.length < 10) {
                setDeck([...deck, char])
            }
        }
    }

    const filteredCharacters = ALL_CHARACTERS.filter(char => {
        if (activeTab === 'all') return true
        return char.franchise?.toLowerCase().replace(/\s+/g, '-') === activeTab
    }).sort((a, b) => {
        const costA = getStatsForCharacter(a).cost
        const costB = getStatsForCharacter(b).cost
        return sortOrder === 'desc' ? costB - costA : costA - costB
    })

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-100px)]">
            {/* Left: Character Selection */}
            <div className="lg:col-span-2 flex flex-col gap-4 h-full">
                <Card className="p-4 flex-1 flex flex-col overflow-hidden">
                    <div className="mb-4 flex justify-between items-center">
                        <h2 className="text-2xl font-bold">Select Your Crew</h2>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')}
                                className="gap-2"
                            >
                                <ArrowUpDown className="w-4 h-4" />
                                Cost: {sortOrder === 'desc' ? 'High to Low' : 'Low to High'}
                            </Button>
                            <Badge variant="outline">{filteredCharacters.length} Characters</Badge>
                        </div>
                    </div>

                    <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full mb-4">
                        <TabsList className="flex flex-wrap h-auto gap-2 bg-transparent justify-start">
                            <TabsTrigger value="all">All</TabsTrigger>
                            <TabsTrigger value="one-piece">One Piece</TabsTrigger>
                            <TabsTrigger value="dragon-ball">Dragon Ball</TabsTrigger>
                            <TabsTrigger value="naruto">Naruto</TabsTrigger>
                            <TabsTrigger value="my-hero-academia">MHA</TabsTrigger>
                        </TabsList>
                    </Tabs>

                    <ScrollArea className="flex-1 pr-4">
                        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 pb-4">
                            {filteredCharacters.map(char => {
                                const isSelected = !!deck.find(c => c.id === char.id)
                                const stats = getStatsForCharacter(char)

                                return (
                                    <div
                                        key={char.id}
                                        className={`relative cursor-pointer transition-all ${isSelected ? 'ring-4 ring-primary rounded-lg scale-95' : 'hover:scale-105'}`}
                                        onClick={() => toggleCharacter(char)}
                                    >
                                        <CharacterCard character={char} />
                                        {isSelected && (
                                            <div className="absolute inset-0 bg-primary/20 rounded-lg flex items-center justify-center">
                                                <Badge className="text-lg">Selected</Badge>
                                            </div>
                                        )}
                                        <div className="absolute top-2 right-2">
                                            <Badge variant="secondary" className="font-mono">Cost: {stats.cost}</Badge>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </ScrollArea>
                </Card>
            </div>

            {/* Right: Current Deck */}
            < div className="flex flex-col gap-4 h-full" >
                <Card className="p-4 flex-1 flex flex-col bg-accent/10 border-primary/20">
                    <div className="mb-4">
                        <h2 className="text-2xl font-bold">Your Deck</h2>
                        <p className="text-muted-foreground">{deck.length} / 10 Characters</p>
                    </div>

                    <ScrollArea className="flex-1 pr-2">
                        <div className="space-y-3">
                            {deck.map((char, index) => {
                                const stats = getStatsForCharacter(char)
                                return (
                                    <div key={char.id} className="flex items-center gap-3 bg-background p-2 rounded-lg border">
                                        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-primary">
                                            <img src={char.image} alt={char.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-bold truncate">{char.name}</p>
                                            <div className="flex gap-2 text-xs text-muted-foreground">
                                                <span>HP: {stats.hp}</span>
                                                <span>ATK: {stats.atk}</span>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end gap-1">
                                            <Badge variant="outline">{stats.cost} Haki</Badge>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-6 w-6 text-destructive hover:text-destructive"
                                                onClick={(e: React.MouseEvent) => {
                                                    e.stopPropagation()
                                                    toggleCharacter(char)
                                                }}
                                            >
                                                ×
                                            </Button>
                                        </div>
                                    </div>
                                )
                            })}

                            {deck.length === 0 && (
                                <div className="text-center py-10 text-muted-foreground border-2 border-dashed rounded-lg">
                                    Select characters from the left to build your deck
                                </div>
                            )}
                        </div>
                    </ScrollArea>

                    <div className="mt-4 pt-4 border-t">
                        <div className="flex justify-between mb-4 text-sm">
                            <span>Avg Cost:</span>
                            <span className="font-mono font-bold">
                                {deck.length > 0
                                    ? (deck.reduce((acc, c) => acc + getStatsForCharacter(c).cost, 0) / deck.length).toFixed(1)
                                    : '0.0'}
                            </span>
                        </div>
                        <Button
                            className="w-full"
                            size="lg"
                            disabled={deck.length !== 10 || isWaiting}
                            onClick={() => onDeckComplete(deck)}
                        >
                            {isWaiting ? 'Waiting for Opponent...' : (deck.length === 10 ? 'Enter Battle' : `Select ${10 - deck.length} More`)}
                        </Button>
                    </div>
                </Card>
            </div >
        </div >
    )
}
