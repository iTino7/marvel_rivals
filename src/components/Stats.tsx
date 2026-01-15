import { useHeroStats } from '@/hooks/useHeroStats'
import type { HeroElement } from '@/lib/types'

interface StatsProps {
  hero: HeroElement
}

function Stats({ hero }: StatsProps) {
  const { data, isLoading, error } = useHeroStats(hero.name)
  const formatValue = (value: unknown) => {
    return String(value)
  }
  const isHiddenKey = (key: string) => {
    const normalized = key.toLowerCase().replace(/_/g, ' ')
    return normalized === 'hero icon' || normalized === 'hero id'
  }

  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0 bg-black/90" />
      <div className="relative z-10 max-w-5xl mx-auto py-20 px-6">
        <h2 className="text-4xl md:text-5xl font-bold text-yellow-400 transform -skew-x-12 mb-8">
          Statistiche dell'eroe
        </h2>
        <div className="mt-8">
          {isLoading && <p className="text-white">Caricamento statistiche...</p>}
          {error && <p className="text-white">Errore nel caricamento delle statistiche.</p>}
          {!isLoading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data && typeof data === 'object' && !Array.isArray(data) ? (
                Object.entries(data as Record<string, unknown>)
                  .filter(([key, value]) => 
                    !isHiddenKey(key) &&
                    value !== null &&
                    value !== undefined &&
                    typeof value !== 'object'
                  )
                  .map(([key, value]) => (
                    <div key={key} className="border-b border-yellow-400/20 pb-3">
                      <p className="text-yellow-300 text-xs uppercase tracking-wide mb-1">
                        {key.replace(/_/g, ' ')}
                      </p>
                      <p className="text-white text-lg">{formatValue(value)}</p>
                    </div>
                  ))
              ) : (
                <p className="text-white">
                  Nessuna statistica disponibile nel formato atteso.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Stats
