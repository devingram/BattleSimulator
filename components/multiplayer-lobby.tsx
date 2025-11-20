'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import type { Character } from '@/types/character'

interface MultiplayerLobbyProps {
  characters: Character[]
  onGameStart: (roomId: string, playerId: string, playerNumber: 1 | 2) => void
  onBack: () => void
}

export function MultiplayerLobby({ characters, onGameStart, onBack }: MultiplayerLobbyProps) {
  const [roomCode, setRoomCode] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const [isJoining, setIsJoining] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const generateRoomCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase()
  }

  const createRoom = async (isAi: boolean = false) => {
    setIsCreating(true)
    setError(null)
    const supabase = createClient()

    try {
      const playerId = crypto.randomUUID()
      const code = generateRoomCode()

      const { data, error } = await supabase
        .from('game_rooms')
        .insert({
          room_code: code,
          player1_id: playerId,
          player2_id: isAi ? 'ai-bot' : null, // Set AI bot immediately if solo
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
          p1_hp: 4000, // Increased HP as per rebalance
          p2_hp: 4000,
          p1_energy: 10, // Increased starting energy
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

      console.log('[v0] Room created:', { roomId: data.id, code, playerId, isAi })
      onGameStart(data.id, playerId, 1)
    } catch (err) {
      console.error('[v0] Error creating room:', err)
      setError(err instanceof Error ? err.message : 'Failed to create room')
    } finally {
      setIsCreating(false)
    }
  }

  const joinRoom = async () => {
    if (!roomCode.trim()) {
      setError('Please enter a room code')
      return
    }

    setIsJoining(true)
    setError(null)
    const supabase = createClient()

    try {
      console.log('[v0] Attempting to join room with code:', roomCode.toUpperCase())
      const playerId = crypto.randomUUID()
      console.log('[v0] Generated player 2 ID:', playerId)

      // Find the room
      const { data: room, error: fetchError } = await supabase
        .from('game_rooms')
        .select('*')
        .eq('room_code', roomCode.toUpperCase())
        .single()

      console.log('[v0] Room lookup result:', { room, error: fetchError })

      if (fetchError) {
        console.error('[v0] Room fetch error:', fetchError)
        throw new Error('Room not found')
      }

      if (room.status !== 'waiting') {
        throw new Error('This game has already started')
      }

      if (room.player2_id) {
        throw new Error('This room is full')
      }

      console.log('[v0] Updating room to add player 2...')

      const { data, error: updateError } = await supabase
        .from('game_rooms')
        .update({
          player2_id: playerId,
          // status: 'in_progress' // REMOVED: Status should remain 'waiting' until decks are submitted
        })
        .eq('id', room.id)
        .select()
        .single()

      console.log('[v0] Update result:', { data, error: updateError })

      if (updateError) {
        console.error('[v0] Update error:', updateError)
        throw updateError
      }

      console.log('[v0] Successfully joined room as Player 2:', { roomId: data.id, playerId })

      await new Promise(resolve => setTimeout(resolve, 500))

      onGameStart(data.id, playerId, 2)
    } catch (err) {
      console.error('[v0] Error joining room:', err)
      setError(err instanceof Error ? err.message : 'Failed to join room')
      setIsJoining(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Button onClick={onBack} variant="outline" className="mb-4">
        Back to Characters
      </Button>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Create Room</CardTitle>
            <CardDescription>Start a new multiplayer draft</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => createRoom()}
              disabled={isCreating || characters.length < 12}
              className="w-full"
            >
              {isCreating ? 'Creating...' : 'Create Multiplayer Room'}
            </Button>
            {characters.length < 12 && (
              <p className="text-sm text-muted-foreground mt-2">
                Need at least 12 characters to start
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Join Room</CardTitle>
            <CardDescription>Enter a room code to join</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="roomCode">Room Code</Label>
              <Input
                id="roomCode"
                placeholder="ABC123"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                maxLength={6}
              />
            </div>
            <Button
              onClick={joinRoom}
              disabled={isJoining || !roomCode.trim()}
              className="w-full"
            >
              {isJoining ? 'Joining...' : 'Join Game'}
            </Button>
          </CardContent>
        </Card>
      </div>

      {error && (
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <p className="text-sm text-destructive">{error}</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
