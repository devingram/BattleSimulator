'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { RefreshCw, Shield, Heart, Users, Crown, Star } from 'lucide-react'
import type { Team } from '@/types/character'
import Image from 'next/image'

interface TeamDisplayProps {
  team: Team
  teamName: string
  teamColor: string
  onReroll: (slotIndex: number) => void
}

const getRoleIcon = (role: string) => {
  switch (role) {
    case 'Captain':
      return Crown
    case 'Vice Captain':
      return Star
    case 'Tank':
      return Shield
    case 'Healer':
      return Heart
    case 'Support':
      return Users
    default:
      return Users
  }
}

const getRoleColor = (role: string) => {
  switch (role) {
    case 'Captain':
      return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30'
    case 'Vice Captain':
      return 'text-blue-400 bg-blue-400/10 border-blue-400/30'
    case 'Tank':
      return 'text-red-400 bg-red-400/10 border-red-400/30'
    case 'Healer':
      return 'text-green-400 bg-green-400/10 border-green-400/30'
    case 'Support':
      return 'text-purple-400 bg-purple-400/10 border-purple-400/30'
    default:
      return 'text-muted-foreground bg-muted/10 border-muted/30'
  }
}

export function TeamDisplay({ team, teamName, teamColor, onReroll }: TeamDisplayProps) {
  return (
    <Card className="p-6 bg-card border-2 border-border overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-6">
        <h2 className={`text-3xl font-bold text-center bg-gradient-to-r ${teamColor} bg-clip-text text-transparent`}>
          {teamName}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {team.map((slot, index) => {
          const RoleIcon = getRoleIcon(slot.role)
          const roleColor = getRoleColor(slot.role)

          return (
            <Card
              key={slot.id}
              className="relative overflow-hidden bg-secondary/50 border-border hover:border-primary/50 transition-all group"
            >
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border ${roleColor}`}>
                    <RoleIcon className="h-3 w-3" />
                    {slot.role}
                  </div>
                  <span className="text-xs font-mono text-muted-foreground">
                    {slot.id}
                  </span>
                </div>

                {slot.character && (
                  <>
                    <div className="relative aspect-square rounded-lg overflow-hidden bg-muted">
                      <Image
                        src={slot.character.image || "/placeholder.svg"}
                        alt={slot.character.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="space-y-1">
                      <h3 className="font-bold text-lg text-card-foreground leading-tight">
                        {slot.character.name}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        {slot.character.tier && (
                          <span className="px-2 py-0.5 rounded bg-primary/20 text-primary font-bold">
                            {slot.character.tier}
                          </span>
                        )}
                        {slot.character.franchise && (
                          <span className="truncate">{slot.character.franchise}</span>
                        )}
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onReroll(index)}
                      className="w-full gap-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <RefreshCw className="h-3 w-3" />
                      Reroll
                    </Button>
                  </>
                )}
              </div>
            </Card>
          )
        })}
      </div>
    </Card>
  )
}
