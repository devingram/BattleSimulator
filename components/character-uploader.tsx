'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Upload, FileJson } from 'lucide-react'
import { Textarea } from '@/components/ui/textarea'
import type { Character } from '@/types/character'

interface CharacterUploaderProps {
  onCharactersLoaded: (characters: Character[]) => void
}

export function CharacterUploader({ onCharactersLoaded }: CharacterUploaderProps) {
  const [jsonInput, setJsonInput] = useState('')
  const [error, setError] = useState('')

  const handleLoadCharacters = () => {
    setError('')
    try {
      console.log('[v0] Raw JSON input:', jsonInput)
      const parsed = JSON.parse(jsonInput)
      console.log('[v0] Parsed JSON:', parsed)
      console.log('[v0] Is array?', Array.isArray(parsed))
      
      // Validate structure
      if (!Array.isArray(parsed)) {
        throw new Error('JSON must be an array of characters')
      }
      
      const validatedCharacters: Character[] = parsed.map((char, index) => {
        if (!char.name || !char.image) {
          throw new Error(`Character at index ${index} missing required fields (name, image)`)
        }
        return {
          id: char.id || `char-${index}`,
          name: char.name,
          image: char.image,
          tier: char.tier,
          franchise: char.franchise
        }
      })

      if (validatedCharacters.length < 12) {
        throw new Error('You need at least 12 characters for a 6v6 battle')
      }

      onCharactersLoaded(validatedCharacters)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid JSON format')
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const content = event.target?.result as string
        setJsonInput(content)
      }
      reader.readAsText(file)
    }
  }

  const sampleJSON = `[
  {
    "id": "1",
    "name": "Goku",
    "image": "/goku-anime.jpg",
    "tier": "S",
    "franchise": "Dragon Ball"
  },
  {
    "id": "2",
    "name": "Naruto",
    "image": "/anime-ninja.png",
    "tier": "A",
    "franchise": "Naruto"
  }
]`

  return (
    <Card className="max-w-3xl mx-auto p-8 bg-card border-2 border-border animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
            <FileJson className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-card-foreground">Load Character Data</h2>
            <p className="text-muted-foreground">Upload or paste your JSON character list</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-card-foreground">
              JSON Character List
            </label>
            <Textarea
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              placeholder={sampleJSON}
              className="min-h-[300px] font-mono text-sm bg-secondary/50 border-input"
            />
          </div>

          {error && (
            <div className="p-4 rounded-lg bg-destructive/10 border border-destructive text-destructive text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-3">
            <Button onClick={handleLoadCharacters} className="flex-1" size="lg">
              <Upload className="mr-2 h-4 w-4" />
              Load Characters
            </Button>
            <label className="flex-1">
              <Button variant="outline" className="w-full" size="lg" asChild>
                <span>
                  <FileJson className="mr-2 h-4 w-4" />
                  Upload JSON File
                </span>
              </Button>
              <input
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>

        <div className="pt-4 border-t border-border">
          <h3 className="text-sm font-medium mb-2 text-card-foreground">Required JSON Schema:</h3>
          <pre className="text-xs bg-secondary/50 p-3 rounded border border-input overflow-x-auto text-muted-foreground">
{`{
  "id": "unique_id",      // string (optional)
  "name": "Character",    // string (required)
  "image": "url",         // string (required)
  "tier": "S",            // string (optional)
  "franchise": "Series"   // string (optional)
}`}
          </pre>
        </div>
      </div>
    </Card>
  )
}
