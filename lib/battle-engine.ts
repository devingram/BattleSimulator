import { GameRoom, BoardUnit } from '@/types/multiplayer'
import { Character } from '@/types/character'

// --- Constants & Config ---

const MAX_HAND_SIZE = 5
const MAX_BOARD_SIZE = 6
const STARTING_HP = 10000
const STARTING_ENERGY = 1
const ENERGY_PER_TURN = 1
const MAX_ENERGY = 10

const TIER_STATS: Record<string, { cost: number; hp: number; atk: number }> = {
    'S+': { cost: 10, hp: 3000, atk: 2000 },
    'S': { cost: 8, hp: 2200, atk: 1600 },
    'A+': { cost: 6, hp: 1700, atk: 1200 },
    'A': { cost: 5, hp: 1400, atk: 1000 },
    'B+': { cost: 4, hp: 1100, atk: 800 },
    'B': { cost: 3, hp: 900, atk: 600 },
    'C+': { cost: 2, hp: 700, atk: 400 },
    'C': { cost: 1, hp: 500, atk: 300 },
}

// Fallback for unknown tiers
const DEFAULT_STATS = { cost: 1, hp: 500, atk: 300 }

// --- Helper Functions ---

export function getStatsForCharacter(char: Character) {
    const tier = char.tier || 'C'
    return TIER_STATS[tier] || DEFAULT_STATS
}

export function createBoardUnit(char: Character): BoardUnit {
    const stats = getStatsForCharacter(char)
    return {
        ...char,
        instanceId: crypto.randomUUID(),
        currentHp: stats.hp,
        maxHp: stats.hp,
        currentAtk: stats.atk,
        cost: stats.cost,
        canAttack: false, // Summoning sickness
        isTank: false // Default, roles can override later
    }
}

// --- Core Battle Logic ---

export function initializeBattle(room: GameRoom): GameRoom {
    // 1. Create Decks from drafted teams (or selected decks later)
    // Triple the deck size (3 copies of each card)
    const p1BaseDeck = room.team1.filter(s => s.character).map(s => s.character!)
    const p2BaseDeck = room.team2.filter(s => s.character).map(s => s.character!)

    const p1Deck = [...p1BaseDeck, ...p1BaseDeck, ...p1BaseDeck]
    const p2Deck = [...p2BaseDeck, ...p2BaseDeck, ...p2BaseDeck]

    // Shuffle decks (simple shuffle)
    const shuffle = (arr: Character[]) => arr.sort(() => Math.random() - 0.5)

    const p1Shuffled = shuffle([...p1Deck])
    const p2Shuffled = shuffle([...p2Deck])

    // Draw initial hands (3 cards)
    const p1Hand = p1Shuffled.splice(0, 3)
    const p2Hand = p2Shuffled.splice(0, 3)

    return {
        ...room,
        status: 'in_progress', // Or a new 'battle' status if we separate draft/battle
        p1_hp: STARTING_HP,
        p2_hp: STARTING_HP,
        p1_energy: STARTING_ENERGY,
        p2_energy: STARTING_ENERGY,
        p1_max_energy: STARTING_ENERGY,
        p2_max_energy: STARTING_ENERGY,
        p1_deck: p1Shuffled,
        p2_deck: p2Shuffled,
        p1_hand: p1Hand,
        p2_hand: p2Hand,
        p1_board: [],
        p2_board: [],
        current_turn: 1,
        turn_phase: 'main'
    }
}

export function startTurn(room: GameRoom): GameRoom {
    const isP1 = room.current_turn === 1

    // 1. Increase Max Energy (up to 10)
    let maxEnergy = isP1 ? room.p1_max_energy : room.p2_max_energy
    maxEnergy = Math.min(maxEnergy + ENERGY_PER_TURN, MAX_ENERGY)

    // 2. Refill Energy
    const currentEnergy = maxEnergy

    // 3. Draw Card
    let deck = isP1 ? [...room.p1_deck] : [...room.p2_deck]
    let hand = isP1 ? [...room.p1_hand] : [...room.p2_hand]

    if (deck.length > 0 && hand.length < MAX_HAND_SIZE) {
        const card = deck.shift()!
        hand.push(card)
    }

    // 4. Wake up units (remove summoning sickness)
    let board = isP1 ? [...room.p1_board] : [...room.p2_board]
    board = board.map(unit => ({ ...unit, canAttack: true }))

    return {
        ...room,
        [isP1 ? 'p1_max_energy' : 'p2_max_energy']: maxEnergy,
        [isP1 ? 'p1_energy' : 'p2_energy']: currentEnergy,
        [isP1 ? 'p1_deck' : 'p2_deck']: deck,
        [isP1 ? 'p1_hand' : 'p2_hand']: hand,
        [isP1 ? 'p1_board' : 'p2_board']: board,
        turn_phase: 'main'
    }
}

export function playCard(room: GameRoom, player: 1 | 2, cardId: string): GameRoom {
    if (room.current_turn !== player) return room // Not your turn

    const isP1 = player === 1
    const hand = isP1 ? [...room.p1_hand] : [...room.p2_hand]
    const board = isP1 ? [...room.p1_board] : [...room.p2_board]
    const energy = isP1 ? room.p1_energy : room.p2_energy

    if (board.length >= MAX_BOARD_SIZE) return room // Board full

    const cardIndex = hand.findIndex(c => c.id === cardId)
    if (cardIndex === -1) return room // Card not in hand

    const card = hand[cardIndex]
    const stats = getStatsForCharacter(card)

    if (energy < stats.cost) return room // Not enough energy

    // Execute Play
    hand.splice(cardIndex, 1)
    const newUnit = createBoardUnit(card)
    board.push(newUnit)

    return {
        ...room,
        [isP1 ? 'p1_hand' : 'p2_hand']: hand,
        [isP1 ? 'p1_board' : 'p2_board']: board,
        [isP1 ? 'p1_energy' : 'p2_energy']: energy - stats.cost
    }
}

export function attackUnit(room: GameRoom, attackerId: string, targetId: string): GameRoom {
    // Simplified combat: Attacker hits Target. Target hits back.
    const isP1Turn = room.current_turn === 1

    const attackerBoard = isP1Turn ? [...room.p1_board] : [...room.p2_board]
    const defenderBoard = isP1Turn ? [...room.p2_board] : [...room.p1_board]

    const attackerIndex = attackerBoard.findIndex(u => u.instanceId === attackerId)
    const defenderIndex = defenderBoard.findIndex(u => u.instanceId === targetId)

    if (attackerIndex === -1 || defenderIndex === -1) return room

    const attacker = { ...attackerBoard[attackerIndex] }
    const defender = { ...defenderBoard[defenderIndex] }

    if (!attacker.canAttack) return room

    // Combat Math
    defender.currentHp -= attacker.currentAtk
    attacker.currentHp -= defender.currentAtk // Counter-attack

    // Update flags
    attacker.canAttack = false

    // Update Boards (remove dead units)
    if (defender.currentHp <= 0) {
        defenderBoard.splice(defenderIndex, 1)
    } else {
        defenderBoard[defenderIndex] = defender
    }

    if (attacker.currentHp <= 0) {
        attackerBoard.splice(attackerIndex, 1)
    } else {
        attackerBoard[attackerIndex] = attacker
    }

    return {
        ...room,
        [isP1Turn ? 'p1_board' : 'p2_board']: attackerBoard,
        [isP1Turn ? 'p2_board' : 'p1_board']: defenderBoard
    }
}

export function attackFace(room: GameRoom, attackerId: string): GameRoom {
    const isP1Turn = room.current_turn === 1

    const attackerBoard = isP1Turn ? [...room.p1_board] : [...room.p2_board]
    const defenderBoard = isP1Turn ? [...room.p2_board] : [...room.p1_board]

    // Check for Taunt/Tank units
    const hasTank = defenderBoard.some(u => u.isTank)
    if (hasTank) {
        console.log('[BattleEngine] Attack blocked by Taunt/Tank unit')
        return room // Must attack tank first
    }

    const attackerIndex = attackerBoard.findIndex(u => u.instanceId === attackerId)
    if (attackerIndex === -1) {
        console.error('[BattleEngine] Attacker not found')
        return room
    }

    const attacker = { ...attackerBoard[attackerIndex] }
    if (!attacker.canAttack) {
        console.log('[BattleEngine] Unit cannot attack (summoning sickness or already attacked)')
        return room
    }

    // Deal Damage to Player
    let p1Hp = room.p1_hp
    let p2Hp = room.p2_hp

    if (isP1Turn) {
        p2Hp -= attacker.currentAtk
    } else {
        p1Hp -= attacker.currentAtk
    }

    attacker.canAttack = false
    attackerBoard[attackerIndex] = attacker

    // Check Win Condition
    let status = room.status
    let winner = null

    if (p1Hp <= 0) {
        status = 'finished'
        winner = 2
    } else if (p2Hp <= 0) {
        status = 'finished'
        winner = 1
    }

    return {
        ...room,
        p1_hp: p1Hp,
        p2_hp: p2Hp,
        [isP1Turn ? 'p1_board' : 'p2_board']: attackerBoard,
        status: status as any,
        winner: winner as 1 | 2 | null
    }
}

export function endTurn(room: GameRoom): GameRoom {
    const nextTurn: 1 | 2 = room.current_turn === 1 ? 2 : 1

    // Update room with next turn
    const nextRoom = {
        ...room,
        current_turn: nextTurn
    }

    // Run startTurn logic for the next player
    return startTurn(nextRoom)
}
