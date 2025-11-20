import type { Character } from '@/types/character'

export const BLEACH_CHARACTERS: Record<string, Character> = {
    'ichigo': { id: 'bl-ichigo', name: 'Ichigo Kurosaki', image: '/characters/bleach/ichigo.jpg', tier: 'S+', franchise: 'Bleach' },
    'aizen': { id: 'bl-aizen', name: 'Sosuke Aizen', image: '/characters/bleach/aizen.jpg', tier: 'S+', franchise: 'Bleach' },
    'yamamoto': { id: 'bl-yamamoto', name: 'Yamamoto Genryusai', image: '/characters/bleach/yamamoto.jpg', tier: 'S', franchise: 'Bleach' },
    'kenpachi': { id: 'bl-kenpachi', name: 'Kenpachi Zaraki', image: '/characters/bleach/kenpachi.jpg', tier: 'S', franchise: 'Bleach' },
    'byakuya': { id: 'bl-byakuya', name: 'Byakuya Kuchiki', image: '/characters/bleach/byakuya.jpg', tier: 'A+', franchise: 'Bleach' },
    'rukia': { id: 'bl-rukia', name: 'Rukia Kuchiki', image: '/characters/bleach/rukia.jpg', tier: 'A', franchise: 'Bleach' },
}
