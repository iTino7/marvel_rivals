import { AbilityStrings } from '@/lib/strings'
import Button from './Button'
import type { HeroElement, Type } from '@/lib/types'

interface AbilityProps {
  hero: HeroElement
  onStatsClick?: () => void
}

function Ability({ hero, onStatsClick }: AbilityProps) {
  const handleStatsClick = () => {
    onStatsClick?.()
  }
  const sanitizeDescription = (text: string) => {
    return text
      .replace(/(\[[\s\S]*?\]|\{[\s\S]*?\}|<[\s\S]*?>)/g, '')
      .replace(/\\[nrt]/g, ' ')
      .replace(/\s{2,}/g, ' ')
      .trim()
  }
  const getAbilityIconUrl = (icon: string) => {
    if (!icon) return ''
    if (icon.startsWith('http://') || icon.startsWith('https://')) {
      return icon
    }
    return `https://marvelrivalsapi.com/rivals/${icon}`
  }

  // Colori per ogni tipo di abilità
  const typeColors: Record<Type, string> = {
    Movement: '#3B82F6', // Blue
    Normal: '#10B981', // Green
    Passive: '#F59E0B', // Yellow
    Ultimate: '#EF4444', // Red
    Weapon: '#8B5CF6', // Purple
  }
  return (
    <div className="relative min-h-screen">
      {/* Base con gradiente sottile - Colori neutri */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-300 via-gray-400 to-gray-500 z-0" />
      
      {/* Divisione diagonale con clip-path - Colori neutri */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-gray-600 via-gray-700 to-gray-800 z-0"
        style={{
          clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 50%)',
          boxShadow: 'inset 0 0 100px rgba(0, 0, 0, 0.3)'
        }}
      />
      
      {/* Texture noise sottile */}
      <div 
        className="absolute inset-0 opacity-[0.03] z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundSize: '200px 200px'
        }}
      />
      
      {/* Ombre di profondità agli angoli */}
      <div 
        className="absolute top-0 left-0 w-1/2 h-full z-0"
        style={{
          background: 'radial-gradient(ellipse at top left, rgba(255,255,255,0.05) 0%, transparent 70%)'
        }}
      />
      <div 
        className="absolute bottom-0 right-0 w-1/2 h-full z-0"
        style={{
          background: 'radial-gradient(ellipse at bottom right, rgba(0,0,0,0.3) 0%, transparent 70%)'
        }}
      />
      
      {/* Gradiente di transizione morbida all'inizio */}
      <div 
        className="absolute top-0 left-0 right-0 h-64 z-20 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0.3) 40%, rgba(0, 0, 0, 0.1) 70%, transparent 100%)'
        }}
      />
      
      {/* Contenuto */}
      <div className="relative z-10 min-h-screen py-20 px-4 md:px-6 lg:px-8 pb-32 md:pb-40">
        {/* Titolo */}
        <div className="flex items-center justify-center gap-4 md:gap-6 mb-12">
          <h2 className="text-white text-4xl md:text-5xl lg:text-6xl font-bold transform -skew-x-12">
            {AbilityStrings.abilities}
          </h2>
          <h2 className="text-white text-4xl md:text-5xl lg:text-6xl font-bold transform -skew-x-12 opacity-60">
            {hero.name}
          </h2>
        </div>
        
        <div className="max-w-7xl mx-auto flex flex-row gap-8 md:gap-12">
          {/* Lista abilità a sinistra */}
          <div className="flex-1 flex flex-col gap-4 md:gap-6">
            {hero.abilities.slice(0, Math.ceil(hero.abilities.length / 2)).map((ability, index) => {
              const typeColor = typeColors[ability.type]
              return (
                <div
                  key={ability.id}
                  className="relative group"
                >
                  {/* Card semplice con solo icona e testo */}
                  <div className="flex items-start gap-4 md:gap-6 hover:opacity-90 transition-opacity">
                    {/* Icona */}
                    {ability.icon && (
                      <div className="flex-shrink-0">
                        <img
                          src={getAbilityIconUrl(ability.icon)}
                          alt={ability.name || 'Ability icon'}
                          className="w-16 h-16 md:w-20 md:h-20 object-contain"
                        />
                      </div>
                    )}
                    
                    {/* Testo */}
                    <div className="flex-1 min-w-0">
                      {ability.name && (
                        <h3 className="text-white text-lg md:text-xl font-bold transform -skew-x-12 mb-2 opacity-100">
                          {ability.name}
                        </h3>
                      )}
                      {ability.description && (
                        <p className="text-white text-sm md:text-base leading-relaxed opacity-100">
                          {sanitizeDescription(ability.description)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
          
          {/* Lista abilità a destra */}
          <div className="flex-1 flex flex-col gap-4 md:gap-6">
            {hero.abilities.slice(Math.ceil(hero.abilities.length / 2)).map((ability, index) => {
              const typeColor = typeColors[ability.type]
              return (
                <div
                  key={ability.id}
                  className="relative group"
                >
                  {/* Card semplice con solo icona e testo */}
                  <div className="flex items-start gap-4 md:gap-6 hover:opacity-90 transition-opacity">
                    {/* Icona */}
                    {ability.icon && (
                      <div className="flex-shrink-0">
                        <img
                          src={getAbilityIconUrl(ability.icon)}
                          alt={ability.name || 'Ability icon'}
                          className="w-16 h-16 md:w-20 md:h-20 object-contain"
                        />
                      </div>
                    )}
                    
                    {/* Testo */}
                    <div className="flex-1 min-w-0">
                      {ability.name && (
                        <h3 className="text-white text-lg md:text-xl font-bold transform -skew-x-12 mb-2 opacity-100">
                          {ability.name}
                        </h3>
                      )}
                      {ability.description && (
                        <p className="text-white text-sm md:text-base leading-relaxed opacity-100">
                          {sanitizeDescription(ability.description)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
      <div className="absolute bottom-8 left-0 right-0 z-20 flex justify-center">
        <Button className="text-xl md:text-2xl" onClick={handleStatsClick}>
          Vai alle statistiche dell'eroe
        </Button>
      </div>
    </div>
  )
}

export default Ability
