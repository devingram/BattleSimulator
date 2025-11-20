'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Download, RotateCcw, Anchor, Skull } from 'lucide-react'

interface VictoryScreenProps {
  onExportPNG?: () => void
  onExportAll?: () => void
  onReset: () => void
  isVictory?: boolean
  playerScore?: number
  opponentScore?: number
}

export function VictoryScreen({ 
  onExportPNG, 
  onExportAll, 
  onReset,
  isVictory = true,
  playerScore,
  opponentScore
}: VictoryScreenProps) {
  const [waves, setWaves] = useState<Array<{ id: number; delay: number }>>([])
  const [treasures, setTreasures] = useState<Array<{ id: number; x: number; delay: number; duration: number }>>([])
  const [show, setShow] = useState(false)

  useEffect(() => {
    setTimeout(() => setShow(true), 100)

    const particles = Array.from({ length: 40 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 0.5,
      duration: 2.5 + Math.random() * 2,
    }))
    setTreasures(particles)

    const waveList = Array.from({ length: 3 }, (_, i) => ({
      id: i,
      delay: i * 0.3,
    }))
    setWaves(waveList)
  }, [])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-b from-blue-950 to-blue-900 overflow-hidden">
      {waves.map((wave) => (
        <div
          key={wave.id}
          className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-blue-800/40 to-transparent animate-wave"
          style={{
            animationDelay: `${wave.delay}s`,
            transform: `translateY(${wave.id * 40}px)`,
          }}
        />
      ))}

      {treasures.map((particle) => (
        <div
          key={particle.id}
          className="absolute text-2xl animate-fall"
          style={{
            left: `${particle.x}%`,
            top: '-50px',
            animationDelay: `${particle.delay}s`,
            animationDuration: `${particle.duration}s`,
          }}
        >
          {isVictory ? '💰' : '💀'}
        </div>
      ))}

      <div
        className={`relative bg-gradient-to-br ${
          isVictory 
            ? 'from-amber-900/95 to-yellow-800/95 border-yellow-500' 
            : 'from-gray-900/95 to-red-900/95 border-red-500'
        } rounded-2xl p-12 border-4 shadow-2xl max-w-2xl w-full mx-4 transform transition-all duration-700 ${
          show ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
        }`}
      >
        <div className={`absolute -inset-1 ${
          isVictory 
            ? 'bg-gradient-to-r from-yellow-500 via-amber-500 to-yellow-500' 
            : 'bg-gradient-to-r from-red-500 via-gray-500 to-red-500'
        } rounded-2xl blur-lg opacity-50 animate-pulse`} />
        
        <div className="relative space-y-8">
          <div className="text-center space-y-4">
            {isVictory ? (
              <Anchor className="w-20 h-20 mx-auto text-yellow-300 animate-bounce" />
            ) : (
              <Skull className="w-20 h-20 mx-auto text-red-400 animate-bounce" />
            )}
            <h2 className={`text-6xl font-bold ${
              isVictory 
                ? 'bg-gradient-to-r from-yellow-300 via-amber-300 to-yellow-300' 
                : 'bg-gradient-to-r from-red-400 via-gray-400 to-red-400'
            } bg-clip-text text-transparent animate-pulse`}>
              {isVictory ? 'TREASURE FOUND!' : 'SHIPWRECKED!'}
            </h2>
            <p className={`text-2xl ${isVictory ? 'text-yellow-200' : 'text-red-200'}`}>
              {isVictory 
                ? "Ye've assembled a legendary crew! ⚓" 
                : "Walk the plank and try again! 💀"}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 py-6">
            <div className={`text-center p-4 bg-black/30 rounded-lg border ${
              isVictory ? 'border-yellow-500/50' : 'border-red-500/50'
            }`}>
              <div className={`text-4xl font-bold ${isVictory ? 'text-yellow-400' : 'text-red-400'}`}>
                {playerScore !== undefined ? `${playerScore}` : '12'}
              </div>
              <div className={`text-sm ${isVictory ? 'text-yellow-200' : 'text-red-200'}`}>
                {playerScore !== undefined ? 'Your Bounty' : 'Crew Members'}
              </div>
            </div>
            <div className={`text-center p-4 bg-black/30 rounded-lg border ${
              isVictory ? 'border-yellow-500/50' : 'border-red-500/50'
            }`}>
              <div className={`text-4xl font-bold ${isVictory ? 'text-amber-400' : 'text-gray-400'}`}>
                {opponentScore !== undefined ? `${opponentScore}` : '6v6'}
              </div>
              <div className={`text-sm ${isVictory ? 'text-yellow-200' : 'text-red-200'}`}>
                {opponentScore !== undefined ? 'Enemy Bounty' : 'Fleet Battle'}
              </div>
            </div>
            <div className={`text-center p-4 bg-black/30 rounded-lg border ${
              isVictory ? 'border-yellow-500/50' : 'border-red-500/50'
            }`}>
              <div className={`text-4xl font-bold ${isVictory ? 'text-blue-400' : 'text-gray-400'}`}>
                {isVictory ? '⚓' : '💀'}
              </div>
              <div className={`text-sm ${isVictory ? 'text-yellow-200' : 'text-red-200'}`}>
                {isVictory ? 'Victory' : 'Defeated'}
              </div>
            </div>
          </div>

          {(onExportPNG || onExportAll) && (
            <div className="flex flex-col sm:flex-row gap-4">
              {onExportPNG && (
                <Button
                  onClick={onExportPNG}
                  size="lg"
                  className={`flex-1 ${
                    isVictory 
                      ? 'bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-700 hover:to-amber-700' 
                      : 'bg-gradient-to-r from-gray-600 to-red-600 hover:from-gray-700 hover:to-red-700'
                  } text-white font-semibold text-lg py-6`}
                >
                  <Download className="mr-2 h-5 w-5" />
                  Claim Treasure (PNG)
                </Button>
              )}
              {onExportAll && (
                <Button
                  onClick={onExportAll}
                  size="lg"
                  variant="outline"
                  className={`flex-1 ${
                    isVictory 
                      ? 'border-yellow-500 text-yellow-200 hover:bg-yellow-900/50' 
                      : 'border-red-500 text-red-200 hover:bg-red-900/50'
                  } font-semibold text-lg py-6`}
                >
                  <Download className="mr-2 h-5 w-5" />
                  Full Haul (All Frames)
                </Button>
              )}
            </div>
          )}

          <Button
            onClick={onReset}
            variant="ghost"
            className={`w-full ${
              isVictory 
                ? 'text-yellow-300 hover:text-yellow-100 hover:bg-yellow-900/30' 
                : 'text-red-300 hover:text-red-100 hover:bg-red-900/30'
            }`}
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Set Sail Again
          </Button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fall {
          to {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
        @keyframes wave {
          0%, 100% {
            transform: translateX(-50%) scaleY(1);
          }
          50% {
            transform: translateX(50%) scaleY(1.2);
          }
        }
        .animate-fall {
          animation: fall linear forwards;
        }
        .animate-wave {
          animation: wave 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
