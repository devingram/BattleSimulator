import { GameRoom, BoardUnit } from '@/types/multiplayer'
import { getStatsForCharacter } from './battle-engine'

export type AiAction =
    | { type: 'play'; cardId: string }
    | { type: 'attack_unit'; attackerId: string; targetId: string }
    | { type: 'attack_face'; attackerId: string }
    | { type: 'end_turn' }

export function calculateAiMove(room: GameRoom): AiAction {
    const isAiTurn = room.current_turn === 2 // AI is always Player 2 for now
    if (!isAiTurn) return { type: 'end_turn' }

    const hand = room.p2_hand
    const board = room.p2_board
    const energy = room.p2_energy
    const opponentBoard = room.p1_board

    // 1. Try to Play Cards
    // Strategy: Play the most expensive card we can afford
    const playableCards = hand
        .filter(card => getStatsForCharacter(card).cost <= energy)
        .sort((a, b) => getStatsForCharacter(b).cost - getStatsForCharacter(a).cost)

    if (playableCards.length > 0) {
        return { type: 'play', cardId: playableCards[0].id }
    }

    // 2. Try to Attack
    const readyUnits = board.filter(u => u.canAttack)

    if (readyUnits.length > 0) {
        const attacker = readyUnits[0]

        // Check for Taunt/Tank
        const tanks = opponentBoard.filter(u => u.isTank)

        if (tanks.length > 0) {
            // Attack the tank with the lowest HP
            const target = tanks.sort((a, b) => a.currentHp - b.currentHp)[0]
            return { type: 'attack_unit', attackerId: attacker.instanceId, targetId: target.instanceId }
        }

        // Otherwise, FACE IS THE PLACE
        return { type: 'attack_face', attackerId: attacker.instanceId }
    }

    // 3. Nothing to do
    return { type: 'end_turn' }
}
