import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { Input } from '@/components/ui/input'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { usePlayerStats } from '@/hooks/usePlayerStats'

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

const isPrimitive = (value: unknown): value is string | number | boolean => {
  return ['string', 'number', 'boolean'].includes(typeof value)
}

const isHiddenKey = (key: string, parentKey?: string): boolean => {
  const normalized = key.toLowerCase().replace(/_/g, '')
  if (
    normalized === 'uid' ||
    normalized === 'isprivate' ||
    normalized === 'updates' ||
    normalized === 'mapid' ||
    normalized === 'mapthumbnail' ||
    normalized === 'matchuid'
  ) {
    return true
  }
  if (normalized === 'name') {
    return parentKey?.toLowerCase() !== 'player'
  }
  return false
}

const isMatchHistoryKey = (key: string): boolean => {
  const normalized = key.toLowerCase().replace(/_/g, '')
  return normalized === 'matchhistory'
}

const getPlayerSummary = (
  payload: Record<string, unknown> | null
): { name?: string; level?: string | number; iconPath?: string } | null => {
  if (!payload || !isRecord(payload.player)) return null
  const player = payload.player as Record<string, unknown>
  const name = typeof player.name === 'string' ? player.name : undefined
  let iconPath: string | undefined
  if (isRecord(player.icon) && typeof player.icon.player_icon === 'string') {
    iconPath = player.icon.player_icon
  }
  const levelKeys = ['level', 'player_level', 'account_level']
  let level: string | number | undefined
  for (const key of levelKeys) {
    const value = player[key]
    if (isPrimitive(value)) {
      level = value
      break
    }
  }
  if (!name && level === undefined && !iconPath) return null
  return { name, level, iconPath }
}

const getPlayerIconSrc = (iconPath?: string): string | null => {
  if (!iconPath) return null
  if (iconPath.startsWith('http://') || iconPath.startsWith('https://')) {
    return iconPath
  }
  return `https://marvelrivalsapi.com/rivals${iconPath}`
}

const normalizePayload = (payload: unknown): Record<string, unknown> | null => {
  if (isRecord(payload)) return payload
  if (Array.isArray(payload) && payload.length > 0 && isRecord(payload[0])) {
    return payload[0]
  }
  return null
}

function PlayerStats() {
  const [searchValue, setSearchValue] = useState('')
  const [submittedValue, setSubmittedValue] = useState('')
  const { data, isLoading, error } = usePlayerStats(submittedValue)
  const normalizedData = useMemo(() => normalizePayload(data), [data])
  const playerSummary = useMemo(() => getPlayerSummary(normalizedData), [normalizedData])
  const hasData = Boolean(normalizedData)

  useEffect(() => {
    const iconSrc = getPlayerIconSrc(playerSummary?.iconPath || undefined)
    if (iconSrc) {
      console.log(iconSrc)
    }
  }, [playerSummary?.iconPath])

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    setSubmittedValue(searchValue.trim())
  }

  return (
    <div className="relative min-h-full w-full bg-black overflow-hidden">
      <div
        className="absolute inset-0 opacity-25"
        style={{
          backgroundImage: 'repeating-linear-gradient(135deg, rgba(251,219,43,0.18) 0, rgba(251,219,43,0.18) 2px, transparent 2px, transparent 28px)'
        }}
      />
      <div className="absolute inset-0 bg-linear-to-br from-black/10 via-transparent to-black/50" />
      <div className="relative z-10 w-full py-20 px-6">
        <h2 className="text-4xl md:text-5xl font-bold text-[#fbdb2b] transform -skew-x-12 mb-8">
          Player Stats
        </h2>
        <div className="max-w-md">
          <form onSubmit={handleSubmit}>
            <Input
              placeholder="Cerca giocatore..."
              className="text-white placeholder:text-gray-400 font-['Rajdhani'] font-semibold"
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
            />
          </form>
        </div>
        {!submittedValue && (
          <p className="text-white mt-6">
            Inserisci un nome giocatore per vedere le statistiche.
          </p>
        )}
        {isLoading && (
          <p className="text-white mt-6">Caricamento statistiche...</p>
        )}
        {error && (
          <p className="text-white mt-6">Errore nel caricamento delle statistiche.</p>
        )}
        {hasData && !isLoading && !error && normalizedData && (
          <div className="mt-8">
            {playerSummary && (
              <div className="mb-8 border border-yellow-400/20 rounded-md p-4 max-w-3xl flex items-center gap-4">
                {getPlayerIconSrc(playerSummary.iconPath) && (
                  <img
                    src={getPlayerIconSrc(playerSummary.iconPath) as string}
                    alt="Player icon"
                    className="w-16 h-16 rounded-full object-cover border border-yellow-400/30"
                  />
                )}
                <div>
                  {playerSummary.name && (
                    <p className="text-white text-xl font-semibold">
                      {playerSummary.name}
                    </p>
                  )}
                  {playerSummary.level !== undefined && (
                    <p className="text-yellow-300 text-sm uppercase tracking-wide mt-2">
                      Livello {playerSummary.level}
                    </p>
                  )}
                </div>
              </div>
            )}
            {Object.entries(normalizedData)
              .filter(([, value]) => Array.isArray(value))
              .filter(([key]) => isMatchHistoryKey(key))
              .map(([key, value]) => {
                const items = (value as unknown[]).filter(isRecord)
                if (items.length === 0) {
                  return <p key={key} className="text-white">Nessuna partita disponibile.</p>
                }
                return (
                  <div key={key}>
                    <h3 className="text-xl text-yellow-300 font-semibold mb-4">
                      {key.replace(/_/g, ' ')}
                    </h3>
                    <Carousel
                      opts={{ align: 'start' }}
                      className="w-full max-w-3xl"
                    >
                      <CarouselContent>
                        {items.map((item, index) => {
                          const itemEntries = Object.entries(item)
                            .filter(([, entryValue]) => isPrimitive(entryValue))
                            .filter(([entryKey]) => !isHiddenKey(entryKey, key))
                          if (itemEntries.length === 0) return null
                          const title = typeof item.name === 'string' && item.name.trim()
                            ? item.name
                            : `Elemento ${index + 1}`
                          return (
                            <CarouselItem key={`${key}-${index}`} className="md:basis-1/2">
                              <div className="border border-yellow-400/20 rounded-md p-4 h-full">
                                <h4 className="text-yellow-300 text-sm uppercase tracking-wide mb-3">
                                  {title}
                                </h4>
                                <div className="grid grid-cols-1 gap-3">
                                  {itemEntries.map(([entryKey, entryValue]) => (
                                    <div key={entryKey} className="border-b border-yellow-400/20 pb-2">
                                      <p className="text-yellow-300 text-xs uppercase tracking-wide mb-1">
                                        {entryKey.replace(/_/g, ' ')}
                                      </p>
                                      <p className="text-white text-sm">{String(entryValue)}</p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </CarouselItem>
                          )
                        })}
                      </CarouselContent>
                      <CarouselPrevious className="-left-4 bg-black/70 text-white hover:bg-black" />
                      <CarouselNext className="-right-4 bg-black/70 text-white hover:bg-black" />
                    </Carousel>
                  </div>
                )
              })}
          </div>
        )}
      </div>
    </div>
  )
}

export default PlayerStats
