import type { Character } from '@/types/character'

export const ONE_PIECE_CHARACTERS: Record<string, Character> = {
    // Top Tier (S+)
    'luffy-gear-5': { id: 'op-luffy-gear-5', name: 'Monkey D. Luffy (Gear 5)', image: '/characters/one-piece/luffy-gear-5.png', tier: 'S+', franchise: 'One Piece' },
    'kaido': { id: 'op-kaido', name: 'Kaido', image: '/characters/one-piece/kaido.png', tier: 'S+', franchise: 'One Piece' },
    'shanks': { id: 'op-shanks', name: 'Shanks', image: '/characters/one-piece/shanks.jpg', tier: 'S+', franchise: 'One Piece' },
    'mihawk': { id: 'op-mihawk', name: 'Mihawk', image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Dracule%20Mihawk-uSQNpVxIAnZJaNhuLTGjnE03D6Mxfw.png', tier: 'S+', franchise: 'One Piece' },
    'blackbeard': { id: 'op-blackbeard', name: 'Blackbeard', image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Marshall%20D.%20Teach%20%28Blackbeard%2C%20Marshall%20D.%20Teech%29-0eAYF6TLi1UzbfAS8HQ27LePW8BP0q.png', tier: 'S+', franchise: 'One Piece' },

    // S Tier
    'big-mom': { id: 'op-big-mom', name: 'Big Mom', image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Charlotte%20Linlin%20%28Big%20Mom%29-6NbGkrzYrQzPaGXKlIW9KIkyoBBoep.png', tier: 'S', franchise: 'One Piece' },
    'akainu': { id: 'op-akainu', name: 'Akainu', image: '/characters/one-piece/akainu.jpg', tier: 'S', franchise: 'One Piece' },
    'dragon': { id: 'op-dragon', name: 'Monkey D. Dragon', image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Monkey%20D.%20Dragon%20%28alternate%29-6lCJW3ouaezZls4LCJll9AFBvOtPU6.png', tier: 'S', franchise: 'One Piece' },
    'kizaru': { id: 'op-kizaru', name: 'Kizaru', image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Borsalino%20%28Kizaru%29-QHmB28qsDPTD24lCN9vdsr4o2tRFDH.png', tier: 'S', franchise: 'One Piece' },
    'aokiji': { id: 'op-aokiji', name: 'Aokiji', image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Kuzan%20%28Aokiji%29-maXvONyhdN0k4JSmYDZQRTlv4CTa86.png', tier: 'S', franchise: 'One Piece' },

    // A+ Tier
    'zoro': { id: 'op-zoro', name: 'Roronoa Zoro', image: '/characters/one-piece/zoro.png', tier: 'A+', franchise: 'One Piece' },
    'law': { id: 'op-law', name: 'Trafalgar Law', image: '/characters/one-piece/law.jpg', tier: 'A+', franchise: 'One Piece' },
    'sabo': { id: 'op-sabo', name: 'Sabo', image: '/characters/one-piece/sabo.jpg', tier: 'A+', franchise: 'One Piece' },
    'marco': { id: 'op-marco', name: 'Marco the Phoenix', image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Marco%20%28pre-timeskip%29-XDcDpueXkbya6NFT3QkTNlelR4hHuk.png', tier: 'A+', franchise: 'One Piece' },
    'yamato': { id: 'op-yamato', name: 'Yamato', image: '/characters/one-piece/yamato.jpg', tier: 'A+', franchise: 'One Piece' },
    'king': { id: 'op-king', name: 'King', image: '/characters/one-piece/king.jpg', tier: 'A+', franchise: 'One Piece' },
    'katakuri': { id: 'op-katakuri', name: 'Charlotte Katakuri', image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Charlotte%20Katakuri-NbxuAnNaRPymy6Z0K8bCHWlfjwQO2n.png', tier: 'A+', franchise: 'One Piece' },
    'ben-beckman': { id: 'op-ben-beckman', name: 'Ben Beckman', image: '/characters/one-piece/ben-beckman.jpg', tier: 'A+', franchise: 'One Piece' },

    // A Tier
    'sanji': { id: 'op-sanji', name: 'Sanji', image: '/characters/one-piece/sanji.jpg', tier: 'A', franchise: 'One Piece' },
    'hancock': { id: 'op-hancock', name: 'Boa Hancock', image: '/characters/one-piece/hancock.jpg', tier: 'A', franchise: 'One Piece' },
    'doflamingo': { id: 'op-doflamingo', name: 'Doflamingo', image: '/characters/one-piece/doflamingo.jpg', tier: 'A', franchise: 'One Piece' },
    'kid': { id: 'op-kid', name: 'Eustass Kid', image: '/characters/one-piece/kid.jpg', tier: 'A', franchise: 'One Piece' },
    'queen': { id: 'op-queen', name: 'Queen', image: '/characters/one-piece/queen.jpg', tier: 'A', franchise: 'One Piece' },
    'jinbe': { id: 'op-jinbe', name: 'Jinbe', image: '/characters/one-piece/jinbe.jpg', tier: 'A', franchise: 'One Piece' },
    'crocodile': { id: 'op-crocodile', name: 'Crocodile', image: '/characters/one-piece/crocodile.jpg', tier: 'A', franchise: 'One Piece' },
    'ace': { id: 'op-ace', name: 'Portgas D. Ace', image: '/characters/one-piece/ace.jpg', tier: 'A', franchise: 'One Piece' },
    'fujitora': { id: 'op-fujitora', name: 'Fujitora', image: '/characters/one-piece/fujitora.jpg', tier: 'A', franchise: 'One Piece' },
    'garp': { id: 'op-garp', name: 'Monkey D. Garp', image: '/characters/one-piece/garp.jpg', tier: 'A', franchise: 'One Piece' },

    // B+ Tier
    'smoker': { id: 'op-smoker', name: 'Smoker', image: '/characters/one-piece/smoker.jpg', tier: 'B+', franchise: 'One Piece' },
    'jack': { id: 'op-jack', name: 'Jack', image: '/characters/one-piece/jack.jpg', tier: 'B+', franchise: 'One Piece' },
    'cracker': { id: 'op-cracker', name: 'Cracker', image: '/characters/one-piece/cracker.jpg', tier: 'B+', franchise: 'One Piece' },
    'perospero': { id: 'op-perospero', name: 'Perospero', image: '/characters/one-piece/perospero.jpg', tier: 'B+', franchise: 'One Piece' },
    'killer': { id: 'op-killer', name: 'Killer', image: '/characters/one-piece/killer.jpg', tier: 'B+', franchise: 'One Piece' },
    'x-drake': { id: 'op-x-drake', name: 'X Drake', image: '/characters/one-piece/x-drake.jpg', tier: 'B+', franchise: 'One Piece' },

    // B Tier
    'franky': { id: 'op-franky', name: 'Franky', image: '/characters/one-piece/franky.jpg', tier: 'B', franchise: 'One Piece' },
    'robin': { id: 'op-robin', name: 'Nico Robin', image: '/characters/one-piece/robin.jpg', tier: 'B', franchise: 'One Piece' },
    'brook': { id: 'op-brook', name: 'Brook', image: '/characters/one-piece/brook.jpg', tier: 'B', franchise: 'One Piece' },
    'vergo': { id: 'op-vergo', name: 'Vergo', image: '/characters/one-piece/vergo.jpg', tier: 'B', franchise: 'One Piece' },
    'pica': { id: 'op-pica', name: 'Pica', image: '/characters/one-piece/pica.jpg', tier: 'B', franchise: 'One Piece' },
    'magellan': { id: 'op-magellan', name: 'Magellan', image: '/characters/one-piece/magellan.jpg', tier: 'B', franchise: 'One Piece' },
    'kuma': { id: 'op-kuma', name: 'Bartholomew Kuma', image: '/characters/one-piece/kuma.jpg', tier: 'B', franchise: 'One Piece' },
    'sentomaru': { id: 'op-sentomaru', name: 'Sentomaru', image: '/characters/one-piece/sentomaru.jpg', tier: 'B', franchise: 'One Piece' },

    // C+ Tier
    'chopper': { id: 'op-chopper', name: 'Tony Tony Chopper', image: '/characters/one-piece/chopper.jpg', tier: 'C+', franchise: 'One Piece' },
    'nami': { id: 'op-nami', name: 'Nami', image: '/characters/one-piece/nami.jpg', tier: 'C+', franchise: 'One Piece' },
    'usopp': { id: 'op-usopp', name: 'Usopp', image: '/characters/one-piece/usopp.jpg', tier: 'C+', franchise: 'One Piece' },
    'caesar': { id: 'op-caesar', name: 'Caesar Clown', image: '/characters/one-piece/caesar.jpg', tier: 'C+', franchise: 'One Piece' },
    'caribou': { id: 'op-caribou', name: 'Caribou', image: '/characters/one-piece/caribou.jpg', tier: 'C+', franchise: 'One Piece' },
    'wyper': { id: 'op-wyper', name: 'Wyper', image: '/characters/one-piece/wyper.jpg', tier: 'C+', franchise: 'One Piece' },
    'paulie': { id: 'op-paulie', name: 'Paulie', image: '/characters/one-piece/paulie.jpg', tier: 'C+', franchise: 'One Piece' },
    'blueno': { id: 'op-blueno', name: 'Blueno', image: '/characters/one-piece/blueno.jpg', tier: 'C+', franchise: 'One Piece' },
}
