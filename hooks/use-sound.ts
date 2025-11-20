import { useCallback, useRef } from 'react'

type SoundType = 'click' | 'select' | 'roll' | 'complete' | 'hover' | 'victory' | 'defeat' | 'attack' | 'damage' | 'play_card' | 'turn_start'

export function useSound() {
  const audioContextRef = useRef<AudioContext | null>(null)

  const createOscillator = (ctx: AudioContext, type: OscillatorType, freq: number, startTime: number, duration: number, volume: number) => {
    const oscillator = ctx.createOscillator()
    const gainNode = ctx.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(ctx.destination)

    oscillator.type = type
    oscillator.frequency.setValueAtTime(freq, startTime)

    gainNode.gain.setValueAtTime(volume, startTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration)

    oscillator.start(startTime)
    oscillator.stop(startTime + duration)
  }

  const play = useCallback((sound: SoundType) => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
      }
      const ctx = audioContextRef.current
      const now = ctx.currentTime

      switch (sound) {
        case 'click':
          createOscillator(ctx, 'sine', 600, now, 0.1, 0.1)
          break
        case 'hover':
          createOscillator(ctx, 'sine', 400, now, 0.05, 0.05)
          break
        case 'select':
          createOscillator(ctx, 'triangle', 500, now, 0.1, 0.1)
          setTimeout(() => createOscillator(ctx, 'triangle', 800, now + 0.05, 0.1, 0.1), 50)
          break
        case 'play_card':
          // Whoosh/Snap effect
          createOscillator(ctx, 'sine', 300, now, 0.2, 0.2)
          createOscillator(ctx, 'triangle', 600, now, 0.1, 0.1)
          break
        case 'attack':
          // Punchy sound
          createOscillator(ctx, 'square', 150, now, 0.1, 0.3)
          createOscillator(ctx, 'sawtooth', 100, now, 0.15, 0.2)
          break
        case 'damage':
          // Low thud
          createOscillator(ctx, 'sawtooth', 80, now, 0.2, 0.4)
          createOscillator(ctx, 'square', 50, now, 0.3, 0.3)
          break
        case 'turn_start':
          // Chime
          createOscillator(ctx, 'sine', 880, now, 0.5, 0.1)
          setTimeout(() => createOscillator(ctx, 'sine', 1100, now + 0.1, 0.5, 0.1), 100)
          break
        case 'victory':
          // Fanfare
          [523, 659, 784, 1047].forEach((freq, i) => {
            setTimeout(() => createOscillator(ctx, 'triangle', freq, now + (i * 0.15), 0.4, 0.2), i * 150)
          })
          break
        case 'defeat':
          // Sad trombone
          [784, 740, 698, 622].forEach((freq, i) => {
            setTimeout(() => createOscillator(ctx, 'sawtooth', freq, now + (i * 0.4), 0.6, 0.2), i * 400)
          })
          break
        case 'complete':
          createOscillator(ctx, 'sine', 523, now, 0.2, 0.2)
          setTimeout(() => createOscillator(ctx, 'sine', 784, now + 0.1, 0.2, 0.2), 100)
          break
      }
    } catch (error) {
      console.error('[v0] Sound playback error:', error)
    }
  }, [])

  return { play }
}
