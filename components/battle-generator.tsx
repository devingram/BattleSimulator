'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { TeamDisplay } from '@/components/team-display'
import { Shuffle, Download, RotateCcw, ArrowLeft } from 'lucide-react'
import type { Character, Team } from '@/types/character'
import html2canvas from 'html2canvas'

interface BattleGeneratorProps {
  characters: Character[]
  onReset: () => void
}

const ROLES: Array<'Captain' | 'Vice Captain' | 'Tank' | 'Healer' | 'Support'> = [
  'Captain',
  'Vice Captain',
  'Tank',
  'Healer',
  'Support',
  'Support'
]

export function BattleGenerator({ characters, onReset }: BattleGeneratorProps) {
  const [teamA, setTeamA] = useState<Team>([])
  const [teamB, setTeamB] = useState<Team>([])
  const [usedCharacterIds, setUsedCharacterIds] = useState<Set<string>>(new Set())
  const exportRef = useRef<HTMLDivElement>(null)

  const getRandomCharacter = (excludeIds: Set<string>): Character => {
    const available = characters.filter(c => !excludeIds.has(c.id))
    if (available.length === 0) {
      throw new Error('Not enough unique characters')
    }
    return available[Math.floor(Math.random() * available.length)]
  }

  const generateTeams = () => {
    const usedIds = new Set<string>()
    
    const newTeamA: Team = ROLES.map((role, index) => {
      const character = getRandomCharacter(usedIds)
      usedIds.add(character.id)
      return {
        id: `A${index + 1}`,
        role,
        character
      }
    })

    const newTeamB: Team = ROLES.map((role, index) => {
      const character = getRandomCharacter(usedIds)
      usedIds.add(character.id)
      return {
        id: `B${index + 1}`,
        role,
        character
      }
    })

    setTeamA(newTeamA)
    setTeamB(newTeamB)
    setUsedCharacterIds(usedIds)
  }

  const rerollSlot = (team: 'A' | 'B', slotIndex: number) => {
    const currentTeam = team === 'A' ? teamA : teamB
    const setTeam = team === 'A' ? setTeamA : setTeamB
    
    const currentSlot = currentTeam[slotIndex]
    if (!currentSlot.character) return

    // Remove current character from used set
    const newUsedIds = new Set(usedCharacterIds)
    newUsedIds.delete(currentSlot.character.id)

    // Get new character
    const newCharacter = getRandomCharacter(newUsedIds)
    newUsedIds.add(newCharacter.id)

    // Update team
    const newTeam = [...currentTeam]
    newTeam[slotIndex] = {
      ...currentSlot,
      character: newCharacter
    }

    setTeam(newTeam)
    setUsedCharacterIds(newUsedIds)
  }

  const exportAsImage = async () => {
    if (!exportRef.current) return

    try {
      const canvas = await html2canvas(exportRef.current, {
        backgroundColor: '#1a1625',
        scale: 2,
        logging: false,
      })

      const link = document.createElement('a')
      link.download = `battle-teams-${Date.now()}.png`
      link.href = canvas.toDataURL()
      link.click()
    } catch (error) {
      console.error('Export failed:', error)
    }
  }

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-card border-2 border-border">
        <div className="flex flex-wrap gap-3 justify-center">
          <Button onClick={onReset} size="lg" variant="outline" className="gap-2">
            <ArrowLeft className="h-5 w-5" />
            Back to Roster
          </Button>
          
          <Button onClick={generateTeams} size="lg" className="gap-2">
            <Shuffle className="h-5 w-5" />
            Generate Teams
          </Button>
          
          {teamA.length > 0 && (
            <Button onClick={exportAsImage} size="lg" variant="outline" className="gap-2">
              <Download className="h-5 w-5" />
              Export as Image
            </Button>
          )}
        </div>

        {teamA.length > 0 && (
          <div className="mt-4 text-center text-sm text-muted-foreground">
            <p>{characters.length} characters loaded • {usedCharacterIds.size} currently in use</p>
          </div>
        )}
      </Card>

      {teamA.length > 0 && teamB.length > 0 && (
        <div ref={exportRef} className="space-y-6">
          <TeamDisplay
            team={teamA}
            teamName="Team A"
            teamColor="from-primary to-accent"
            onReroll={(slotIndex) => rerollSlot('A', slotIndex)}
          />
          
          <div className="flex items-center justify-center py-4">
            <div className="h-px flex-1 bg-border" />
            <span className="px-6 text-2xl font-bold text-muted-foreground">VS</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <TeamDisplay
            team={teamB}
            teamName="Team B"
            teamColor="from-accent to-chart-3"
            onReroll={(slotIndex) => rerollSlot('B', slotIndex)}
          />
        </div>
      )}
    </div>
  )
}
