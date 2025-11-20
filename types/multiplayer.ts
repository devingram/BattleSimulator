export interface GameRoom {
  id: string
  room_code: string
  created_at: string
  status: 'waiting' | 'in_progress' | 'completed' | 'finished'
  winner: 1 | 2 | null | 'completed'
  current_turn: 1 | 2
  current_character: Character | null
  reroll_available: boolean
  player1_id: string | null
  player2_id: string | null
  team1: TeamSlot[]
  team2: TeamSlot[]
  draft_history: DraftAction[]
  used_character_ids: string[]

  // Battle System Fields
  p1_hp: number
  p2_hp: number
  p1_energy: number
  p2_energy: number
  p1_max_energy: number
  p2_max_energy: number
  p1_hand: Character[]
  p2_hand: Character[]
  p1_board: BoardUnit[]
  p2_board: BoardUnit[]
  p1_deck: Character[]
  p2_deck: Character[]
  turn_phase: 'draw' | 'main' | 'battle' | 'end'
}

export interface BoardUnit extends Character {
  instanceId: string // Unique ID for this specific unit on board
  currentHp: number
  maxHp: number
  currentAtk: number
  cost: number
  canAttack: boolean
  isTank: boolean
}

export interface DraftAction {
  action: 'roll' | 'reroll' | 'place'
  player: 1 | 2
  character: Character
  slotIndex?: number
  timestamp: string
}

export interface PlayerInfo {
  playerId: string
  playerNumber: 1 | 2
  isMyTurn: boolean
}

import type { Character } from './character'
import type { TeamSlot } from './character'
