'use client'

import { useState, useEffect, useRef } from 'react'
import { GameRoom, BoardUnit } from '@/types/multiplayer'
import { Character } from '@/types/character'
import { CharacterCard } from './character-card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { getStatsForCharacter } from '@/lib/battle-engine'
import { BattleResult } from './battle-result'
import { Zap, Heart, Shield, Sword, Skull } from 'lucide-react'
import { useSound } from '@/hooks/use-sound'

interface BattleBoardProps {
    room: GameRoom
    playerNumber: 1 | 2
    onPlayCard: (cardId: string) => void
    onAttackUnit: (attackerId: string, targetId: string) => void
    onAttackFace: (attackerId: string) => void
    onEndTurn: () => void
    onBack: () => void
}

export function BattleBoard({
    room,
    playerNumber,
    onPlayCard,
    onAttackUnit,
    onAttackFace,
    onEndTurn,
    onBack
}: BattleBoardProps) {
    const [selectedAttackerId, setSelectedAttackerId] = useState<string | null>(null)
    const { play } = useSound()

    const isMyTurn = room.current_turn === playerNumber

    // Play turn start sound
    useEffect(() => {
        if (isMyTurn) {
            play('turn_start')
        }
    }, [isMyTurn, play])

    // Play victory/defeat sound
    useEffect(() => {
        if (room.status === 'finished') {
            if (room.winner === playerNumber) {
                play('victory')
            } else {
                play('defeat')
            }
        }
    }, [room.status, room.winner, playerNumber, play])

    // Helper to get data based on perspective
    const myHp = playerNumber === 1 ? room.p1_hp : room.p2_hp
    const oppHp = playerNumber === 1 ? room.p2_hp : room.p1_hp

    // Play damage sound when I take damage (from opponent)
    const prevMyHp = useRef(myHp)
    useEffect(() => {
        if (myHp < prevMyHp.current) {
            // If it's NOT my turn, it means the opponent attacked me.
            // If it IS my turn, I might have hurt myself (unlikely) or it's a delayed update.
            // But usually, if I attack, I play the sound optimistically.
            // To avoid double sounds, we can check !isMyTurn, OR just play it always and remove the optimistic one?
            // For responsiveness, optimistic is better.
            // Let's play it if !isMyTurn.
            if (!isMyTurn) {
                play('damage')
                play('attack') // Also play attack sound for impact
            }
        }
        prevMyHp.current = myHp
    }, [myHp, isMyTurn, play])

    const myEnergy = playerNumber === 1 ? room.p1_energy : room.p2_energy
    const myMaxEnergy = playerNumber === 1 ? room.p1_max_energy : room.p2_max_energy

    const oppEnergy = playerNumber === 1 ? room.p2_energy : room.p1_energy
    const oppMaxEnergy = playerNumber === 1 ? room.p2_max_energy : room.p1_max_energy

    const myHand = playerNumber === 1 ? room.p1_hand : room.p2_hand
    const oppHandCount = playerNumber === 1 ? room.p2_hand.length : room.p1_hand.length

    const myBoard = playerNumber === 1 ? room.p1_board : room.p2_board
    const oppBoard = playerNumber === 1 ? room.p2_board : room.p1_board

    const handleUnitClick = (unit: BoardUnit, isOpponent: boolean) => {
        if (!isMyTurn) return

        if (isOpponent) {
            // Attacking an enemy unit
            if (selectedAttackerId) {
                play('attack')
                setTimeout(() => play('damage'), 200)
                onAttackUnit(selectedAttackerId, unit.instanceId)
                setSelectedAttackerId(null)
            }
        } else {
            // Selecting my unit to attack
            if (unit.canAttack) {
                play('select')
                setSelectedAttackerId(unit.instanceId === selectedAttackerId ? null : unit.instanceId)
            }
        }
    }

    const handleFaceClick = () => {
        if (selectedAttackerId && isMyTurn) {
            play('attack')
            setTimeout(() => play('damage'), 200)
            onAttackFace(selectedAttackerId)
            setSelectedAttackerId(null)
        }
    }

    const handlePlayCard = (cardId: string) => {
        play('play_card')
        onPlayCard(cardId)
    }

    return (
        <div className="flex flex-col h-screen bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black text-white overflow-hidden font-sans selection:bg-yellow-500/30">

            {room.status === 'finished' && (
                <BattleResult
                    winner={room.winner as 1 | 2 | null}
                    playerNumber={playerNumber}
                    stats={{
                        damageDealt: playerNumber === 1 ? (10000 - room.p2_hp) : (10000 - room.p1_hp),
                        turns: 8, // TODO: Track actual turns
                        xp: room.winner === playerNumber ? 500 : 100,
                        coins: room.winner === playerNumber ? 100 : 25
                    }}
                    onBack={onBack}
                />
            )}

            {/* --- OPPONENT AREA (Top) --- */}
            <div className="relative bg-gradient-to-b from-black/80 to-transparent p-4 pb-8 flex-shrink-0">
                <div className="flex justify-between items-start max-w-7xl mx-auto">

                    {/* Opponent Avatar & Stats */}
                    <div className="flex items-center gap-6">
                        <div
                            className={`relative group cursor-pointer transition-all duration-300 ${selectedAttackerId ? 'scale-105' : ''}`}
                            onClick={handleFaceClick}
                        >
                            <div className={`w-20 h-20 rounded-full border-4 flex items-center justify-center bg-slate-800 shadow-xl overflow-hidden ${selectedAttackerId ? 'border-red-500 shadow-red-500/50 animate-pulse' : 'border-slate-700'}`}>
                                <span className="text-3xl font-bold text-slate-500">P{playerNumber === 1 ? 2 : 1}</span>
                            </div>

                            {/* HP Bar */}
                            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-24 bg-slate-900 rounded-full border border-slate-700 py-1 px-2 flex items-center justify-center gap-1 shadow-lg">
                                <Heart className="fill-red-500 text-red-500 w-3 h-3" />
                                <span className="text-xs font-bold text-white">{oppHp}</span>
                            </div>

                            {selectedAttackerId && (
                                <div className="absolute inset-0 rounded-full bg-red-500/20 animate-ping" />
                            )}
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <div className="h-3 w-32 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                                    <div className="h-full bg-blue-500 transition-all duration-500" style={{ width: `${(oppEnergy / oppMaxEnergy) * 100}%` }} />
                                </div>
                                <span className="text-xs text-blue-400 font-mono"><Zap className="inline w-3 h-3" /> {oppEnergy}</span>
                            </div>
                            <div className="flex gap-1">
                                {Array.from({ length: oppHandCount }).map((_, i) => (
                                    <div key={i} className="w-8 h-12 bg-slate-800 rounded border border-slate-600 shadow-sm transform hover:-translate-y-1 transition-transform" />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Turn Indicator (Top Right) */}
                    {!isMyTurn && (
                        <div className="bg-red-500/10 border border-red-500/50 text-red-200 px-6 py-2 rounded-full font-bold animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.2)]">
                            OPPONENT'S TURN
                        </div>
                    )}
                </div>

                {/* Opponent Board */}
                <div className="flex justify-center gap-4 mt-8 min-h-[180px] perspective-1000">
                    {oppBoard.map(unit => (
                        <div
                            key={unit.instanceId}
                            className={`relative w-36 group transition-all duration-300 ${selectedAttackerId ? 'cursor-crosshair hover:scale-105 hover:shadow-[0_0_30px_rgba(239,68,68,0.4)]' : ''}`}
                            onClick={() => handleUnitClick(unit, true)}
                        >
                            <div className={`relative rounded-xl overflow-hidden border-2 shadow-2xl transition-colors ${selectedAttackerId ? 'border-red-500/50 group-hover:border-red-500' : 'border-slate-700'}`}>
                                <CharacterCard character={unit} compact className="h-48" />

                                {/* Stats Overlay */}
                                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-2 pt-8 flex justify-between items-end">
                                    <div className="flex items-center gap-1 text-red-300 font-bold text-lg drop-shadow-md">
                                        <Sword size={16} className="fill-red-500/20" /> {unit.currentAtk}
                                    </div>
                                    <div className="flex items-center gap-1 text-green-300 font-bold text-lg drop-shadow-md">
                                        <Heart size={16} className="fill-green-500/20" /> {unit.currentHp}
                                    </div>
                                </div>

                                {unit.isTank && (
                                    <div className="absolute top-2 right-2 bg-slate-900/80 p-1.5 rounded-full border border-slate-600 text-blue-400 shadow-lg">
                                        <Shield size={14} />
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* --- BATTLEFIELD DIVIDER --- */}
            <div className="flex-1 flex items-center justify-center relative my-4">
                <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent absolute" />

                {isMyTurn && (
                    <Button
                        size="lg"
                        className="z-10 bg-yellow-500 hover:bg-yellow-400 text-black font-black text-xl px-12 py-8 rounded-2xl shadow-[0_0_30px_rgba(234,179,8,0.4)] hover:shadow-[0_0_50px_rgba(234,179,8,0.6)] transition-all hover:scale-105 active:scale-95 border-4 border-yellow-600/20"
                        onClick={() => {
                            play('click')
                            onEndTurn()
                        }}
                    >
                        END TURN
                    </Button>
                )}
            </div>

            {/* --- PLAYER AREA (Bottom) --- */}
            <div className="bg-gradient-to-t from-black/90 to-transparent p-4 pt-8 flex-shrink-0">

                {/* My Board */}
                <div className="flex justify-center gap-4 mb-8 min-h-[180px]">
                    {myBoard.map(unit => (
                        <div
                            key={unit.instanceId}
                            className={`relative w-36 transition-all duration-300 transform ${unit.canAttack && isMyTurn ? 'cursor-pointer hover:-translate-y-4 hover:shadow-[0_0_30px_rgba(234,179,8,0.3)]' : 'opacity-90'} ${selectedAttackerId === unit.instanceId ? '-translate-y-6 scale-105 shadow-[0_0_40px_rgba(234,179,8,0.5)] z-10' : ''}`}
                            onClick={() => handleUnitClick(unit, false)}
                        >
                            <div className={`relative rounded-xl overflow-hidden border-2 transition-colors ${selectedAttackerId === unit.instanceId ? 'border-yellow-400' : 'border-slate-600'}`}>
                                <CharacterCard character={unit} compact className="h-48" />

                                {/* Stats Overlay */}
                                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-2 pt-8 flex justify-between items-end">
                                    <div className="flex items-center gap-1 text-red-300 font-bold text-lg drop-shadow-md">
                                        <Sword size={16} className="fill-red-500/20" /> {unit.currentAtk}
                                    </div>
                                    <div className="flex items-center gap-1 text-green-300 font-bold text-lg drop-shadow-md">
                                        <Heart size={16} className="fill-green-500/20" /> {unit.currentHp}
                                    </div>
                                </div>

                                {!unit.canAttack && (
                                    <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px] flex items-center justify-center">
                                        <span className="text-2xl font-bold text-white/50">ZZZ</span>
                                    </div>
                                )}
                            </div>

                            {selectedAttackerId === unit.instanceId && (
                                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-yellow-500 text-black font-bold px-3 py-1 rounded-full text-sm animate-bounce shadow-lg">
                                    ATTACK!
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* My Controls & Hand */}
                <div className="max-w-7xl mx-auto flex items-end gap-8 pb-4">

                    {/* My Stats */}
                    <div className="w-64 bg-slate-900/80 backdrop-blur-md p-4 rounded-2xl border border-slate-700 shadow-2xl">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                                P{playerNumber}
                            </div>
                            <div className="text-3xl font-black text-white flex items-center gap-2">
                                <Heart className="fill-red-500 text-red-500" /> {myHp}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between text-sm font-bold text-blue-300 uppercase tracking-wider">
                                <span className="flex items-center gap-1"><Zap size={14} /> Haki</span>
                                <span>{myEnergy}/{myMaxEnergy}</span>
                            </div>
                            <Progress
                                value={(myEnergy / myMaxEnergy) * 100}
                                className="h-3 bg-slate-800 border border-slate-700"
                                indicatorClassName="bg-gradient-to-r from-blue-500 to-cyan-400"
                            />
                        </div>
                    </div>

                    {/* Hand */}
                    <div className="flex-1 flex justify-center items-end perspective-1000 h-48">
                        {myHand.map((card, index) => {
                            const stats = getStatsForCharacter(card)
                            const canPlay = isMyTurn && myEnergy >= stats.cost && myBoard.length < 6

                            // Calculate overlap based on hand size
                            const overlap = myHand.length > 5 ? -60 : -30

                            return (
                                <div
                                    key={card.id + index}
                                    className={`
                                        relative w-32 transition-all duration-300 origin-bottom
                                        ${canPlay ? 'cursor-pointer hover:-translate-y-12 hover:scale-110 hover:!z-50 hover:rotate-0' : 'opacity-60 grayscale hover:opacity-100 hover:grayscale-0 hover:!z-50'}
                                    `}
                                    style={{
                                        marginLeft: index > 0 ? `${overlap}px` : '0',
                                        zIndex: index,
                                        transform: `rotate(${(index - (myHand.length - 1) / 2) * 5}deg) translateY(${Math.abs(index - (myHand.length - 1) / 2) * 5}px)`
                                    }}
                                    onClick={() => canPlay && handlePlayCard(card.id)}
                                >
                                    <div className={`relative rounded-lg overflow-hidden border-2 shadow-xl bg-slate-900 ${canPlay ? 'border-slate-500 hover:border-yellow-400' : 'border-slate-800'}`}>
                                        <CharacterCard character={card} compact className="h-48" />

                                        {/* Cost Badge */}
                                        <div className="absolute top-1 right-1 bg-blue-600 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full shadow-md border border-blue-400">
                                            {stats.cost}
                                        </div>

                                        {/* Stats (Mini) */}
                                        <div className="absolute bottom-0 inset-x-0 bg-black/80 p-1 flex justify-between text-[10px] font-bold text-white px-2">
                                            <span className="text-red-300">⚔ {stats.atk}</span>
                                            <span className="text-green-300">♥ {stats.hp}</span>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    {/* Spacer to balance the layout (matches Stats width) */}
                    <div className="w-64 hidden lg:block" />
                </div>
            </div>
        </div>
    )
}
