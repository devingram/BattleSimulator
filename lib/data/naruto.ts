import type { Character } from '@/types/character'

export const NARUTO_CHARACTERS: Record<string, Character> = {
    'naruto': { id: 'nar-naruto', name: 'Naruto Uzumaki', image: '/characters/naruto/naruto.jpg', tier: 'S', franchise: 'Naruto' },
    'sasuke': { id: 'nar-sasuke', name: 'Sasuke Uchiha', image: '/characters/naruto/sasuke.jpg', tier: 'S', franchise: 'Naruto' },
    'madara': { id: 'nar-madara', name: 'Madara Uchiha', image: '/characters/naruto/madara.jpg', tier: 'S+', franchise: 'Naruto' },
    'hashirama': { id: 'nar-hashirama', name: 'Hashirama Senju', image: '/characters/naruto/hashirama.jpg', tier: 'S', franchise: 'Naruto' },
    'kakashi': { id: 'nar-kakashi', name: 'Kakashi Hatake', image: '/characters/naruto/kakashi.jpg', tier: 'A+', franchise: 'Naruto' },
    'itachi': { id: 'nar-itachi', name: 'Itachi Uchiha', image: '/characters/naruto/itachi.jpg', tier: 'S', franchise: 'Naruto' },
    'minato': { id: 'nar-minato', name: 'Minato Namikaze', image: '/characters/naruto/minato.jpg', tier: 'S', franchise: 'Naruto' },
    'sakura': { id: 'nar-sakura', name: 'Sakura Haruno', image: '/characters/naruto/sakura.jpg', tier: 'A', franchise: 'Naruto' },
}
