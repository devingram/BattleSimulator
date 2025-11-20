# Character Image Organization Guide

## Folder Structure

All character images are organized in the `/public/characters/` directory by franchise:

\`\`\`
/public/
├── characters/
│   ├── one-piece/
│   │   ├── luffy-gear-5.jpg
│   │   ├── zoro.jpg
│   │   ├── kaido.jpg
│   │   └── ...
│   ├── dragon-ball/
│   │   ├── goku.jpg
│   │   ├── vegeta.jpg
│   │   └── ...
│   ├── naruto/
│   │   ├── naruto.jpg
│   │   ├── sasuke.jpg
│   │   └── ...
│   ├── bleach/
│   │   ├── ichigo.jpg
│   │   └── ...
│   └── my-hero-academia/
│       ├── all-might.jpg
│       ├── deku.jpg
│       └── ...
└── placeholder.svg (fallback image)
\`\`\`

## Image Naming Convention

- Use lowercase kebab-case for all filenames
- Format: `character-name.jpg` or `character-name.png`
- Examples:
  - `luffy-gear-5.jpg`
  - `roronoa-zoro.jpg`
  - `monkey-d-dragon.jpg`

## Adding New Characters

### 1. Add the Image File
Place the image in the appropriate franchise folder:
\`\`\`
/public/characters/[franchise-name]/[character-name].jpg
\`\`\`

### 2. Add to Character Database
Open `/lib/character-database.ts` and add the character entry:

\`\`\`typescript
'[franchise-key]': {
  'character-key': {
    id: '[franchise-abbr]-[character-key]',
    name: 'Character Display Name',
    image: '/characters/[franchise-name]/[character-name].jpg',
    tier: 'S+', // S+, S, A+, A, B+, B, C+, etc.
    franchise: 'Franchise Name'
  },
}
\`\`\`

### 3. Example - Adding Nico Robin

1. Save image to: `/public/characters/one-piece/nico-robin.jpg`
2. Add to database in `character-database.ts`:

\`\`\`typescript
'one-piece': {
  // ... existing characters ...
  'nico-robin': {
    id: 'op-nico-robin',
    name: 'Nico Robin',
    image: '/characters/one-piece/nico-robin.jpg',
    tier: 'B',
    franchise: 'One Piece'
  },
}
\`\`\`

## Image Requirements

- **Format**: JPG or PNG
- **Recommended Size**: 400x400px minimum
- **Aspect Ratio**: Square images work best (1:1)
- **File Size**: Keep under 500KB for optimal loading
- **Quality**: High enough resolution for clear display

## Creating New Franchise

To add a completely new anime franchise:

### 1. Create Folder
\`\`\`bash
mkdir public/characters/[franchise-name]
\`\`\`

### 2. Add to Database
In `/lib/character-database.ts`, add new franchise object:

\`\`\`typescript
export const CHARACTER_DATABASE = {
  // ... existing franchises ...
  
  '[franchise-key]': {
    'character-1': {
      id: '[abbr]-character-1',
      name: 'Character Name',
      image: '/characters/[franchise-name]/character-1.jpg',
      tier: 'S',
      franchise: 'Franchise Display Name'
    },
    // ... more characters
  },
}
\`\`\`

### 3. Create Preset (Optional)
Add a preset in the `CHARACTER_PRESETS` array:

\`\`\`typescript
export const CHARACTER_PRESETS: CharacterPreset[] = [
  // ... existing presets ...
  {
    id: '[franchise-key]-preset',
    name: 'Franchise Name Collection',
    description: 'Description of this character roster',
    characters: getCharactersByFranchise('[franchise-key]')
  }
]
\`\`\`

## Migrating Existing Images

Current images need to be moved to the new structure:

### From Root `/public/` to Organized Folders

**Current Location** → **New Location**
- `/public/luffy-gear-5.jpg` → `/public/characters/one-piece/luffy-gear-5.jpg`
- `/public/goku-anime.jpg` → `/public/characters/dragon-ball/goku.jpg`
- `/public/kaido-one-piece.jpg` → `/public/characters/one-piece/kaido.jpg`

After moving files, paths in `character-database.ts` will automatically work.

## Database Helper Functions

Use these functions to query characters:

\`\`\`typescript
import {
  getAllCharacters,
  getCharactersByFranchise,
  getCharactersByTier,
  getCharacterById
} from '@/lib/character-database'

// Get all characters from all franchises
const allChars = getAllCharacters()

// Get all One Piece characters
const onePieceChars = getCharactersByFranchise('one-piece')

// Get all S+ tier characters
const topTier = getCharactersByTier('S+')

// Get specific character by ID
const luffy = getCharacterById('op-luffy-gear-5')
\`\`\`

## Fallback Images

If a character image is missing or fails to load, the app uses:
- `/placeholder.svg` - Generic placeholder

Always test new character additions to ensure images load correctly!
