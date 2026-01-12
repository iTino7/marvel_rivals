import { AbilityStrings } from '@/lib/strings'
import type { HeroElement, Ability as AbilityType } from '@/lib/types'

interface AbilityProps {
  hero: HeroElement
}

function Ability({ hero }: AbilityProps) {
  const getAbilityIconUrl = (icon: string) => {
    if (!icon) return ''
    if (icon.startsWith('http://') || icon.startsWith('https://')) {
      return icon
    }
    return `https://marvelrivalsapi.com/rivals/${icon}`
  }
  return (
    <div className="min-h-screen relative overflow-hidden">
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
      <div className="relative z-10 min-h-screen py-20 px-4 md:px-6 lg:px-8">
        {/* Titolo */}
        <div className="flex items-center justify-center gap-4 md:gap-6 mb-12">
          <h2 className="text-white text-4xl md:text-5xl lg:text-6xl font-bold transform -skew-x-12">
            {AbilityStrings.abilities}
          </h2>
          <h2 className="text-white text-4xl md:text-5xl lg:text-6xl font-bold transform -skew-x-12 opacity-60">
            {hero.name}
          </h2>
        </div>
        
        {/* Lista abilità */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {hero.abilities.map((ability) => (
            <div
              key={ability.id}
              className="bg-black/40 border-2 border-white/30 rounded-lg p-6 hover:border-yellow-400 transition-all duration-200 transform -skew-x-12"
            >
              {/* Icona e nome */}
              <div className="flex items-center gap-4 mb-4">
                {ability.icon && (
                  <img
                    src={getAbilityIconUrl(ability.icon)}
                    alt={ability.name || 'Ability icon'}
                    className="w-16 h-16 object-contain"
                  />
                )}
                <div>
                  {ability.name && (
                    <h3 className="text-white text-xl md:text-2xl font-bold mb-1">
                      {ability.name}
                    </h3>
                  )}
                  <span className="text-yellow-400 text-sm font-semibold">
                    {ability.type}
                  </span>
                </div>
              </div>
              
              {/* Descrizione */}
              {ability.description && (
                <p className="text-white text-sm md:text-base leading-relaxed opacity-90">
                  {ability.description}
                </p>
              )}
              
              {/* Campi aggiuntivi */}
              {ability.additional_fields && Object.keys(ability.additional_fields).length > 0 && (
                <div className="mt-4 pt-4 border-t border-white/20">
                  {Object.entries(ability.additional_fields).map(([key, value]) => (
                    <div key={key} className="mb-2">
                      <span className="text-yellow-400 text-xs font-semibold uppercase">{key}:</span>
                      <span className="text-white text-sm ml-2">{value}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Ability
