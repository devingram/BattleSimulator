'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { GameRoom } from '@/types/multiplayer'
import { Character } from '@/types/character'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { Loader2 } from 'lucide-react'
import { DeckBuilder } from './deck-builder'
import { BattleBoard } from './battle-board'
import { initializeBattle, startTurn, playCard, attackUnit, attackFace, endTurn, getStatsForCharacter } from '@/lib/battle-engine'
import { calculateAiMove } from '@/lib/ai-opponent'

interface MultiplayerDraftProps {
  roomId: string
  playerId: string
  playerNumber: 1 | 2
  characters: Character[] // Kept for compatibility, but DeckBuilder uses its own data
  onLeave: () => void
}

export function MultiplayerDraft({ roomId, playerId, playerNumber, onLeave }: MultiplayerDraftProps) {
  const [gameRoom, setGameRoom] = useState<GameRoom | null>(null)
  const [isAiMode, setIsAiMode] = useState(false)
  const [isWaiting, setIsWaiting] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false) // Prevent rapid actions
  const supabase = createClient()
  const { toast } = useToast()

  // --- Initial Fetch & Realtime Subscription ---
  useEffect(() => {
    const fetchRoom = async () => {
      const { data, error } = await supabase
        .from('game_rooms')
        .select('*')
        .eq('id', roomId)
        .single()

      if (data) {
        setGameRoom(data as GameRoom)
        setIsAiMode(data.player2_id === 'ai-bot')
      }
    }

    fetchRoom()

    const channel = supabase
      .channel(`game_room_${roomId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'game_rooms',
          filter: `id=eq.${roomId}`,
        },
        (payload) => {
          setGameRoom(payload.new as GameRoom)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [roomId, supabase])

  // Check if we are already waiting (re-joining a room where we submitted but opponent hasn't)
  useEffect(() => {
    if (gameRoom && !isAiMode && gameRoom.status === 'waiting') {
      const myTeam = playerNumber === 1 ? gameRoom.team1 : gameRoom.team2
      const isReady = myTeam.every(s => s.character)
      if (isReady) setIsWaiting(true)
    }
  }, [gameRoom, playerNumber, isAiMode])

  // --- AI Logic Loop ---
  useEffect(() => {
    if (!gameRoom || !isAiMode || gameRoom.current_turn !== 2 || gameRoom.status !== 'in_progress') return

    const runAiTurn = async () => {
      // Small delay for realism
      await new Promise(resolve => setTimeout(resolve, 1500))

      const action = calculateAiMove(gameRoom)

      let newRoom = { ...gameRoom }
      let description = ""
      let title = ""
      let variant: "default" | "destructive" = "default"

      if (action.type === 'play') {
        newRoom = playCard(newRoom, 2, action.cardId)
        title = "AI Played a Card"
        description = "The AI summoned a unit!"
      } else if (action.type === 'attack_unit') {
        newRoom = attackUnit(newRoom, action.attackerId, action.targetId)
        title = "AI Attacked!"
        description = "Your unit took damage."
      } else if (action.type === 'attack_face') {
        newRoom = attackFace(newRoom, action.attackerId)
        title = "AI Attacked You!"
        description = "Direct hit to your Life Points!"
        variant = "destructive"
      } else {
        newRoom = endTurn(newRoom)
        title = "AI Ended Turn"
        description = "It's your turn now."
      }

      if (title) {
        toast({ title, description, variant })
      }

      // Optimistic update
      setGameRoom(newRoom)

      // Persist to DB
      await supabase
        .from('game_rooms')
        .update(newRoom)
        .eq('id', gameRoom.id)
    }

    runAiTurn()
  }, [gameRoom, isAiMode, supabase, toast])


  // --- Actions ---

  const handleDeckComplete = async (deck: Character[]) => {
    if (!gameRoom) return

    // Strict validation: Deck must have exactly 10 characters
    if (deck.length !== 10) {
      toast({
        title: "Invalid Deck",
        description: "You must select exactly 10 characters.",
        variant: "destructive"
      })
      return
    }

    // Fetch latest room state to ensure we have the other player's team
    // This prevents race conditions where P1 submits but P2's local state hasn't updated yet
    const { data: latestData, error } = await supabase
      .from('game_rooms')
      .select('*')
      .eq('id', roomId)
      .single()

    if (error || !latestData) {
      console.error("Failed to fetch latest room data", error)
      return
    }

    let updatedRoom = latestData as GameRoom

    // Map deck to TeamSlots (reusing the structure for now, or we could add a 'deck' column properly)
    // The Battle Engine expects 'p1_deck' etc, but initializeBattle creates them from 'team1'/'team2'
    // So we populate team1/team2 with the selected characters.

    const teamSlots = deck.map(c => ({
      id: crypto.randomUUID(),
      role: 'Captain' as const,
      character: c
    }))

    if (playerNumber === 1) {
      updatedRoom.team1 = teamSlots

      if (isAiMode) {
        // Generate AI Deck (Mirror for now)
        updatedRoom.team2 = deck.map(c => ({
          id: crypto.randomUUID(),
          role: 'Captain' as const,
          character: c
        }))

        // Initialize Battle immediately for Solo
        updatedRoom = initializeBattle(updatedRoom)
        updatedRoom = startTurn(updatedRoom) // Start P1 turn
      }
    } else {
      updatedRoom.team2 = teamSlots
    }

    // Check if BOTH teams are ready (for Multiplayer)
    // This ensures that regardless of who finishes last (P1 or P2), the battle starts.
    if (!isAiMode && updatedRoom.status === 'waiting') {
      // Check length explicitly to avoid empty array "every" returning true
      const p1Ready = updatedRoom.team1.length === 10 && updatedRoom.team1.every(s => s.character)
      const p2Ready = updatedRoom.team2.length === 10 && updatedRoom.team2.every(s => s.character)

      console.log('[v0] Checking readiness:', { p1Ready, p2Ready, p1Team: updatedRoom.team1, p2Team: updatedRoom.team2 })

      if (p1Ready && p2Ready) {
        console.log('[v0] Both teams ready! Initializing battle...')
        updatedRoom = initializeBattle(updatedRoom)
        updatedRoom = startTurn(updatedRoom)
      } else {
        console.log('[v0] Waiting for opponent...')
        toast({
          title: "Deck Submitted",
          description: "Waiting for opponent to finish drafting...",
        })
        setIsWaiting(true)
      }
    }

    setGameRoom(updatedRoom)

    await supabase
      .from('game_rooms')
      .update(updatedRoom)
      .eq('id', gameRoom.id)
  }

  const handleAttackFace = async (attackerId: string) => {
    if (!gameRoom) return

    // Optimistic update
    const previousRoom = { ...gameRoom }
    const newRoom = attackFace(gameRoom, attackerId)
    setGameRoom(newRoom)

    const { error } = await supabase.from('game_rooms').update(newRoom).eq('id', gameRoom.id)

    if (error) {
      console.error("Failed to update game state:", error)
      toast({
        title: "Connection Error",
        description: `Failed to sync game state: ${error.message}`,
        variant: "destructive"
      })
      setGameRoom(previousRoom) // Revert
    }
  }

  const handleAttackUnit = async (attackerId: string, targetId: string) => {
    if (!gameRoom) return

    const previousRoom = { ...gameRoom }
    const newRoom = attackUnit(gameRoom, attackerId, targetId)
    setGameRoom(newRoom)

    const { error } = await supabase.from('game_rooms').update(newRoom).eq('id', gameRoom.id)

    if (error) {
      console.error("Failed to update game state:", error)
      toast({
        title: "Connection Error",
        description: `Failed to sync game state: ${error.message}`,
        variant: "destructive"
      })
      setGameRoom(previousRoom)
    }
  }

  const handlePlayCard = async (cardId: string) => {
    if (!gameRoom || isProcessing) return

    // Validate we have enough energy BEFORE attempting to play
    const isP1 = playerNumber === 1
    const currentEnergy = isP1 ? gameRoom.p1_energy : gameRoom.p2_energy
    const hand = isP1 ? gameRoom.p1_hand : gameRoom.p2_hand
    const board = isP1 ? gameRoom.p1_board : gameRoom.p2_board

    const card = hand.find(c => c.id === cardId)
    if (!card) {
      console.error('[PlayCard] Card not found in hand')
      return
    }

    const stats = getStatsForCharacter(card)

    // Validate energy cost
    if (currentEnergy < stats.cost) {
      toast({
        title: "Not Enough Haki!",
        description: `This card costs ${stats.cost} Haki, but you only have ${currentEnergy}.`,
        variant: "destructive"
      })
      return
    }

    // Validate board space
    if (board.length >= 6) {
      toast({
        title: "Board Full!",
        description: "You can only have 6 units on the board.",
        variant: "destructive"
      })
      return
    }

    setIsProcessing(true)
    const previousRoom = { ...gameRoom }
    const newRoom = playCard(gameRoom, playerNumber, cardId)

    // Double-check that energy was actually deducted (safety check)
    const newEnergy = isP1 ? newRoom.p1_energy : newRoom.p2_energy
    if (newEnergy === currentEnergy) {
      // Card wasn't played (battle engine rejected it)
      console.error('[PlayCard] Battle engine rejected card play')
      setIsProcessing(false)
      return
    }

    setGameRoom(newRoom)

    const { error } = await supabase.from('game_rooms').update(newRoom).eq('id', gameRoom.id)

    if (error) {
      console.error("Failed to update game state:", error)
      toast({
        title: "Connection Error",
        description: `Failed to sync game state: ${error.message}`,
        variant: "destructive"
      })
      setGameRoom(previousRoom)
    }

    setIsProcessing(false)
  }

  const handleEndTurn = async () => {
    if (!gameRoom) return

    const previousRoom = { ...gameRoom }
    const newRoom = endTurn(gameRoom)
    setGameRoom(newRoom)

    const { error } = await supabase.from('game_rooms').update(newRoom).eq('id', gameRoom.id)

    if (error) {
      console.error("Failed to update game state:", error)
      toast({
        title: "Connection Error",
        description: `Failed to sync game state: ${error.message}`,
        variant: "destructive"
      })
      setGameRoom(previousRoom)
    }
  }

  // --- Render ---

  if (!gameRoom) {
    return <div className="flex items-center justify-center h-screen"><Loader2 className="animate-spin" /></div>
  }

  if (gameRoom.status === 'waiting') {
    return (
      <div className="container mx-auto p-4">
        <div className="flex flex-col gap-4 mb-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold">Deck Building Phase</h2>
              <div className="flex items-center gap-2 text-muted-foreground">
                <div
                  className="flex items-center gap-2 bg-muted px-3 py-1.5 rounded cursor-pointer hover:bg-muted/80 transition-colors"
                  onClick={() => {
                    navigator.clipboard.writeText(gameRoom.room_code)
                    toast({
                      title: "Copied!",
                      description: "Room code copied to clipboard",
                    })
                  }}
                  title="Click to copy code"
                >
                  <span className="text-sm">Room Code:</span>
                  <span className="font-mono font-bold text-primary text-lg">{gameRoom.room_code}</span>
                </div>
                {gameRoom.player2_id ? (
                  <span className="text-green-500 text-sm flex items-center gap-1 ml-2">● Opponent Connected</span>
                ) : (
                  <span className="text-yellow-500 text-sm flex items-center gap-1 ml-2">● Waiting for Opponent...</span>
                )}
              </div>
            </div>
            <Button variant="outline" onClick={onLeave}>Leave Game</Button>
          </div>
        </div>
        <DeckBuilder onDeckComplete={handleDeckComplete} isWaiting={isWaiting} />
      </div>
    )
  }

  return (
    <BattleBoard
      room={gameRoom}
      playerNumber={playerNumber}
      onPlayCard={handlePlayCard}
      onAttackUnit={handleAttackUnit}
      onAttackFace={handleAttackFace}
      onEndTurn={handleEndTurn}
      onBack={onLeave}
    />
  )
}
