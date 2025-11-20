
import type { Character } from '@/types/character'

export type Role = 'captain' | 'vice-captain' | 'tank' | 'healer' | 'support1' | 'support2'

export interface TeamSlot {
    role: Role
    character: Character | null
}

export interface DraftFrame {
    type: 'roll' | 'reroll' | 'placed' | 'final'
    timestamp: number
    currentCharacter: Character | null
    leftTeam: TeamSlot[]
    rightTeam: TeamSlot[]
    currentTeam: 'left' | 'right'
    pickNumber: number
}

export interface DraftState {
    currentTeam: 'left' | 'right'
    currentCharacter: Character | null
    availableCharacters: Character[]
    hasRerolled: boolean
    leftTeam: TeamSlot[]
    rightTeam: TeamSlot[]
    draftComplete: boolean
    frameHistory: DraftFrame[]
    pickNumber: number
}

export type DraftAction =
    | { type: 'ROLL_CHARACTER'; character: Character }
    | { type: 'REROLL_CHARACTER'; character: Character }
    | { type: 'PLACE_CHARACTER'; role: Role }
    | { type: 'RESET_DRAFT'; characters: Character[] }

export const ROLES: { id: Role; label: string }[] = [
    { id: 'captain', label: 'CAPTAIN' },
    { id: 'vice-captain', label: 'VICE CAPTAIN' },
    { id: 'tank', label: 'TANK' },
    { id: 'healer', label: 'HEALER' },
    { id: 'support1', label: 'SUPPORT' },
    { id: 'support2', label: 'SUPPORT' },
]

export const INITIAL_DRAFT_STATE = (characters: Character[]): DraftState => ({
    currentTeam: 'left',
    currentCharacter: null,
    availableCharacters: [...characters],
    hasRerolled: false,
    leftTeam: ROLES.map(role => ({ role: role.id, character: null })),
    rightTeam: ROLES.map(role => ({ role: role.id, character: null })),
    draftComplete: false,
    frameHistory: [],
    pickNumber: 0,
})

export function draftReducer(state: DraftState, action: DraftAction): DraftState {
    switch (action.type) {
        case 'ROLL_CHARACTER': {
            const newFrame: DraftFrame = {
                type: 'roll',
                timestamp: Date.now(),
                currentCharacter: action.character,
                leftTeam: state.leftTeam,
                rightTeam: state.rightTeam,
                currentTeam: state.currentTeam,
                pickNumber: state.pickNumber + 1,
            }

            return {
                ...state,
                currentCharacter: action.character,
                hasRerolled: false,
                frameHistory: [...state.frameHistory, newFrame],
                pickNumber: state.pickNumber + 1,
            }
        }

        case 'REROLL_CHARACTER': {
            const newFrame: DraftFrame = {
                type: 'reroll',
                timestamp: Date.now(),
                currentCharacter: action.character,
                leftTeam: state.leftTeam,
                rightTeam: state.rightTeam,
                currentTeam: state.currentTeam,
                pickNumber: state.pickNumber,
            }

            return {
                ...state,
                currentCharacter: action.character,
                hasRerolled: true,
                frameHistory: [...state.frameHistory, newFrame],
            }
        }

        case 'PLACE_CHARACTER': {
            const team = state.currentTeam === 'left' ? state.leftTeam : state.rightTeam
            const slotIndex = team.findIndex(slot => slot.role === action.role)

            if (slotIndex === -1 || !state.currentCharacter) return state

            const updatedTeam = [...team]
            updatedTeam[slotIndex] = { role: action.role, character: state.currentCharacter }

            const newLeftTeam = state.currentTeam === 'left' ? updatedTeam : state.leftTeam
            const newRightTeam = state.currentTeam === 'right' ? updatedTeam : state.rightTeam

            const updatedAvailable = state.availableCharacters.filter(
                c => c.id !== state.currentCharacter!.id
            )

            // Check if all slots are filled (12 slots total)
            const totalFilled = [...newLeftTeam, ...newRightTeam].filter(s => s.character).length
            const isComplete = totalFilled >= 12
            const nextTeam = state.currentTeam === 'left' ? 'right' : 'left'

            const placedFrame: DraftFrame = {
                type: 'placed',
                timestamp: Date.now(),
                currentCharacter: null,
                leftTeam: newLeftTeam,
                rightTeam: newRightTeam,
                currentTeam: nextTeam,
                pickNumber: state.pickNumber,
            }

            return {
                ...state,
                leftTeam: newLeftTeam,
                rightTeam: newRightTeam,
                currentCharacter: null,
                availableCharacters: updatedAvailable,
                currentTeam: nextTeam,
                hasRerolled: false,
                draftComplete: isComplete,
                frameHistory: [...state.frameHistory, placedFrame],
            }
        }

        case 'RESET_DRAFT':
            return INITIAL_DRAFT_STATE(action.characters)

        default:
            return state
    }
}
