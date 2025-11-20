'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { MultiplayerLobby } from '@/components/multiplayer-lobby'
import { MultiplayerDraft } from '@/components/multiplayer-draft'
import { DEFAULT_CHARACTERS } from '@/lib/default-characters'
import { Button } from '@/components/ui/button'
import { useSound } from '@/hooks/use-sound'
import type { Character } from '@/types/character'
import { Loader2 } from 'lucide-react'

type Mode = 'menu' | 'lobby' | 'game'

export default function Home() {
  const [characters] = useState<Character[]>(DEFAULT_CHARACTERS)
  const [mode, setMode] = useState<Mode>('menu')
  const [gameRoomId, setGameRoomId] = useState<string>('')
  const [playerId, setPlayerId] = useState<string>('')
  const [playerNumber, setPlayerNumber] = useState<1 | 2>(1)
  const [isCreating, setIsCreating] = useState(false)
  const { play } = useSound()

  const handleGameStart = (roomId: string, pId: string, pNumber: 1 | 2) => {
    setGameRoomId(roomId)
    setPlayerId(pId)
    setPlayerNumber(pNumber)
    setMode('game')
  }

  const startSoloGame = async () => {
    setIsCreating(true)
    const supabase = createClient()

    try {
      const pId = crypto.randomUUID()
      const code = Math.random().toString(36).substring(2, 8).toUpperCase()

      const { data, error } = await supabase
        .from('game_rooms')
        .insert({
          room_code: code,
          player1_id: pId,
          player2_id: 'ai-bot',
          status: 'waiting',
          current_turn: 1,
          current_character: null,
          reroll_available: false,
          used_character_ids: [],
          team1: Array(6).fill(null).map((_, i) => ({
            id: `team1-slot-${i}`,
            role: ['Captain', 'Vice Captain', 'Tank', 'Healer', 'Support', 'Support'][i],
            character: null
          })),
          team2: Array(6).fill(null).map((_, i) => ({
            id: `team2-slot-${i}`,
            role: ['Captain', 'Vice Captain', 'Tank', 'Healer', 'Support', 'Support'][i],
            character: null
          })),
          // Initialize Battle Fields explicitly
          p1_hp: 4000,
          p2_hp: 4000,
          p1_energy: 10,
          p2_energy: 10,
          p1_max_energy: 10,
          p2_max_energy: 10,
          p1_hand: [],
          p2_hand: [],
          p1_board: [],
          p2_board: [],
          p1_deck: [],
          p2_deck: [],
          turn_phase: 'draw'
        })
        .select()
        .single()

      if (error) throw error

      handleGameStart(data.id, pId, 1)
    } catch (err) {
      console.error('Error creating AI game:', err)
    } finally {
      setIsCreating(false)
    }
  }

  // Full screen game modes
  if (mode === 'game') {
    return (
      <MultiplayerDraft
        roomId={gameRoomId}
        playerId={playerId}
        playerNumber={playerNumber}
        characters={characters}
        onLeave={() => setMode('menu')}
      />
    )
  }

  if (mode === 'lobby') {
    return (
      <div className="min-h-screen bg-background p-8">
        <MultiplayerLobby
          characters={characters}
          onGameStart={handleGameStart}
          onBack={() => setMode('menu')}
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="max-w-4xl w-full text-center space-y-12">
        <header className="space-y-6">
          <h1 className="text-7xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-br from-yellow-400 via-orange-500 to-red-600 drop-shadow-2xl animate-in fade-in slide-in-from-top-10 duration-1000">
            BATTLE CHRONICLES
          </h1>
          <p className="text-2xl text-muted-foreground font-light tracking-wide">
            Draft your team. Command your destiny.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
          <Button
            onClick={startSoloGame}
            disabled={isCreating}
            onMouseEnter={() => play('hover')}
            className="h-32 text-2xl bg-gradient-to-br from-blue-600 to-blue-800 hover:from-blue-500 hover:to-blue-700 border-2 border-blue-400/30 shadow-lg hover:shadow-blue-500/20 transition-all hover:scale-105"
          >
            {isCreating ? (
              <Loader2 className="mr-2 h-8 w-8 animate-spin" />
            ) : (
              <div className="flex flex-col items-center gap-2">
                <span className="font-black uppercase tracking-widest">Play Solo</span>
                <span className="text-sm font-normal opacity-80">vs AI Opponent</span>
              </div>
            )}
          </Button>

          <Button
            onClick={() => setMode('lobby')}
            onMouseEnter={() => play('hover')}
            className="h-32 text-2xl bg-gradient-to-br from-purple-600 to-purple-800 hover:from-purple-500 hover:to-purple-700 border-2 border-purple-400/30 shadow-lg hover:shadow-purple-500/20 transition-all hover:scale-105"
          >
            <div className="flex flex-col items-center gap-2">
              <span className="font-black uppercase tracking-widest">Multiplayer</span>
              <span className="text-sm font-normal opacity-80">Challenge Friends</span>
            </div>
          </Button>
        </div>
      </div>
    </div>
  )
}
