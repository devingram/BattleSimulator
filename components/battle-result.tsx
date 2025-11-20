'use client'

import { Button } from '@/components/ui/button'
import { Trophy, Skull } from 'lucide-react'
import { motion } from 'framer-motion'

export interface BattleStats {
    damageDealt: number
    turns: number
    xp: number
    coins: number
}

interface BattleResultProps {
    winner: 1 | 2 | null
    playerNumber: 1 | 2
    stats?: BattleStats
    onBack: () => void
}

export function BattleResult({ winner, playerNumber, stats, onBack }: BattleResultProps) {
    const isVictory = winner === playerNumber

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-1000">
            <div className="relative flex flex-col items-center justify-center p-12 text-center">

                {/* Background Glow */}
                <div className={`absolute inset-0 blur-[100px] opacity-50 ${isVictory ? 'bg-yellow-500' : 'bg-red-900'}`} />

                <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", duration: 0.8 }}
                    className="relative z-10"
                >
                    {isVictory ? (
                        <div className="flex flex-col items-center gap-2">
                            <Trophy className="w-24 h-24 text-yellow-400 drop-shadow-[0_0_30px_rgba(250,204,21,0.6)] animate-bounce" />
                            <h1 className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 to-yellow-600 drop-shadow-2xl tracking-tighter">
                                VICTORY
                            </h1>
                            <p className="text-xl text-yellow-200 font-bold tracking-widest uppercase">
                                You are the King of Pirates!
                            </p>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-2">
                            <Skull className="w-24 h-24 text-red-500 drop-shadow-[0_0_30px_rgba(239,68,68,0.6)] animate-pulse" />
                            <h1 className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-red-500 to-red-900 drop-shadow-2xl tracking-tighter">
                                DEFEAT
                            </h1>
                            <p className="text-xl text-red-300 font-bold tracking-widest uppercase">
                                Crushed by the enemy...
                            </p>
                        </div>
                    )}

                    {/* Stats & Rewards Grid */}
                    <div className="grid grid-cols-2 gap-6 mt-8 w-full max-w-2xl mx-auto">
                        {/* Battle Stats */}
                        <div className="bg-black/40 rounded-xl p-6 border border-white/10 backdrop-blur-sm">
                            <h3 className="text-lg font-bold text-white mb-4 uppercase tracking-wider border-b border-white/10 pb-2">Battle Stats</h3>
                            <div className="space-y-2 text-left text-sm">
                                <div className="flex justify-between text-gray-400">
                                    <span>Damage Dealt</span>
                                    <span className="font-mono font-bold text-white">{stats?.damageDealt || 0}</span>
                                </div>
                                <div className="flex justify-between text-gray-400">
                                    <span>Turns</span>
                                    <span className="font-mono font-bold text-white">{stats?.turns || 0}</span>
                                </div>
                            </div>
                        </div>

                        {/* Rewards */}
                        <div className="bg-black/40 rounded-xl p-6 border border-white/10 backdrop-blur-sm">
                            <h3 className="text-lg font-bold text-white mb-4 uppercase tracking-wider border-b border-white/10 pb-2">Rewards</h3>
                            <div className="space-y-2 text-left text-sm">
                                <div className="flex justify-between text-yellow-200/80">
                                    <span>EXP Gained</span>
                                    <span className="font-mono font-bold">+{stats?.xp || 0}</span>
                                </div>
                                <div className="flex justify-between text-yellow-200/80">
                                    <span>Coins</span>
                                    <span className="font-mono font-bold">+{stats?.coins || 0}</span>
                                </div>
                                {isVictory && (
                                    <div className="mt-2 pt-2 border-t border-white/10 text-center">
                                        <div className="inline-block px-2 py-1 bg-purple-900/50 border border-purple-500/50 rounded text-purple-200 text-xs font-bold">
                                            Mysterious Shard Found!
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="mt-10 flex gap-4 justify-center">
                        <Button
                            size="lg"
                            onClick={onBack}
                            variant="outline"
                            className="text-lg px-8 py-6 rounded-full font-bold border-2 hover:bg-white/10 hover:text-white transition-all"
                        >
                            RETURN TO MENU
                        </Button>
                        <Button
                            size="lg"
                            onClick={() => window.location.reload()}
                            className={`
                                text-lg px-8 py-6 rounded-full font-black border-2 shadow-xl transition-all hover:scale-105
                                ${isVictory
                                    ? 'bg-yellow-500 hover:bg-yellow-400 text-black border-yellow-300 shadow-yellow-500/20'
                                    : 'bg-red-600 hover:bg-red-500 text-white border-red-400 shadow-red-600/20'}
                            `}
                        >
                            PLAY AGAIN
                        </Button>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}
