import { useEffect, useMemo } from 'react'
import { useMapNames } from '@/hooks/useMapNames'
import { useMatchHistory } from '@/hooks/useMatchHistory'
import type { MatchHistoryElement } from '@/lib/matchHistoryTypes'

interface MatchHistoryProps {
  query: string
}

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

const getHeroIconSrc = (iconPath?: string): string | null => {
  if (!iconPath) return null
  if (iconPath.startsWith('http://') || iconPath.startsWith('https://')) {
    return iconPath
  }
  return `https://marvelrivalsapi.com/rivals${iconPath}`
}

const formatMatchTime = (timestamp?: number): string | null => {
  if (!timestamp) return null
  const ms = timestamp > 1e12 ? timestamp : timestamp * 1000
  const matchDate = new Date(ms)
  if (Number.isNaN(matchDate.getTime())) return null
  const diffMs = Date.now() - matchDate.getTime()
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  if (days >= 14) return '2 weeks ago'
  if (days >= 7) return '1 week ago'
  return matchDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

const toAbsoluteMapUrl = (url: string): string => {
  if (url.startsWith('http://')) return url.replace('http://', 'https://')
  if (url.startsWith('https://')) return url
  return `https://marvelrivalsapi.com${url.startsWith('/') ? url : `/${url}`}`
}

const buildMapImageFallbacks = (url?: string | null): string[] => {
  if (!url) return []
  const fallbacks = new Set<string>()
  const absolute = toAbsoluteMapUrl(url)

  if (absolute.includes('/large/')) {
    fallbacks.add(absolute)
    fallbacks.add(absolute.replace('/large/', '/xl/'))
  } else if (absolute.includes('/xl/')) {
    fallbacks.add(absolute)
    fallbacks.add(absolute.replace('/xl/', '/large/'))
  } else {
    fallbacks.add(absolute.replace('/maps/', '/rivals/maps/large/'))
    fallbacks.add(absolute.replace('/maps/', '/rivals/maps/xl/'))
    fallbacks.add(absolute.replace('/maps/', '/maps/large/'))
    fallbacks.add(absolute)
  }

  if (absolute.includes('/rivals/')) {
    fallbacks.add(absolute.replace('/rivals/', '/'))
  }

  return Array.from(fallbacks)
}

const loggedMapErrors = new Set<string>()

const getMatchInfo = (item: MatchHistoryElement) => {
  if (!item || !isRecord(item.match_player)) return null
  const player = item.match_player as Record<string, unknown>
  const playerHero = isRecord(player.player_hero) ? (player.player_hero as Record<string, unknown>) : null
  const heroIcon = playerHero && typeof playerHero.hero_type === 'string' ? playerHero.hero_type : undefined
  const heroName = playerHero && typeof playerHero.hero_name === 'string' ? playerHero.hero_name : undefined
  const matchTimestamp = typeof item.match_time_stamp === 'number' ? item.match_time_stamp : undefined
  const isWin = isRecord(player.is_win)
    ? Boolean((player.is_win as Record<string, unknown>).is_win)
    : undefined
  const matchType = typeof player.score_info === 'object' ? 'Competitive' : 'Quick Match'
  const isMvp = typeof item.mvp_uid === 'number' && typeof player.player_uid === 'number'
    ? item.mvp_uid === player.player_uid
    : false
  const isSvp = typeof item.svp_uid === 'number' && typeof player.player_uid === 'number'
    ? item.svp_uid === player.player_uid
    : false
  return {
    heroIcon,
    heroName,
    matchTimestamp,
    isWin,
    isMvp,
    isSvp,
    matchType,
    mapId: item.match_map_id,
    mapThumbnail: item.map_thumbnail,
  }
}

function MatchHistory({ query }: MatchHistoryProps) {
  const { data, isLoading, error } = useMatchHistory(query)
  const matches = data?.match_history ?? []
  const mapIds = useMemo(() => {
    if (!matches) return []
    return matches
      .map((match) => (typeof match.match_map_id === 'number' ? match.match_map_id : null))
      .filter((id): id is number => id !== null)
  }, [matches])
  const { data: mapNames } = useMapNames(mapIds)

  useEffect(() => {
    if (!matches || matches.length === 0 || !mapNames) return
    matches.forEach((match) => {
      if (typeof match.match_map_id !== 'number') return
      const mapInfo = mapNames.get(match.match_map_id)
      if (mapInfo?.imageLarge) {
        console.log('match map image', {
          matchMapId: match.match_map_id,
          url: mapInfo.imageLarge
        })
      }
    })
  }, [matches, mapNames])

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto">
        <p className="text-white">Caricamento match...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto">
        <p className="text-white">Errore nel caricamento dei match.</p>
      </div>
    )
  }

  if (!matches || matches.length === 0) {
    return (
      <div className="max-w-3xl mx-auto">
        <p className="text-white">Nessuna partita disponibile.</p>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h3 className="text-xl text-yellow-300 font-semibold mb-4">
        Match history
      </h3>
      <div className="space-y-4">
        {matches.map((item, index) => {
          const matchInfo = getMatchInfo(item)
          if (!matchInfo) return null
          const title = `Match ${index + 1}`
          const mapInfo = matchInfo.mapId !== undefined ? mapNames?.get(matchInfo.mapId) : undefined
          const mapName = mapInfo?.name
          const mapImageLarge = mapInfo?.imageLarge
          const mapFallbacks = buildMapImageFallbacks(mapImageLarge || matchInfo.mapThumbnail)
          return (
            <div key={`${item.match_uid ?? 'match'}-${index}`} className="relative border-2 border-yellow-400/20 rounded-md p-4 overflow-hidden">
              <div
                className={`absolute top-0 right-0 w-10 h-10 rotate-45 translate-x-1/2 -translate-y-1/2 ${
                  matchInfo.isWin ? 'bg-green-700/70' : 'bg-red-700/70'
                }`}
              />
              <h4 className="text-yellow-300 text-sm uppercase tracking-wide mb-3">
                {title}
              </h4>
              <div className="flex items-center justify-between gap-6">
                <div className="flex items-start gap-4">
                  {getHeroIconSrc(matchInfo.heroIcon) && (
                    <img
                      src={getHeroIconSrc(matchInfo.heroIcon) as string}
                      alt="Hero icon"
                      className="w-24 h-24 rounded-md object-cover"
                    />
                  )}
                  {(matchInfo.heroName || formatMatchTime(matchInfo.matchTimestamp) || matchInfo.isMvp || matchInfo.isSvp) && (
                    <div>
                      {matchInfo.heroName && (
                        <p className="text-white text-base font-semibold capitalize">
                          {matchInfo.heroName}
                        </p>
                      )}
                      {(matchInfo.isMvp || matchInfo.isSvp) && (
                        <p
                          className={`text-xs font-semibold mt-1 ${
                            matchInfo.isMvp ? 'text-yellow-300' : 'text-blue-300'
                          }`}
                        >
                          {matchInfo.isMvp ? 'MVP' : 'SVP'}
                        </p>
                      )}
                      {formatMatchTime(matchInfo.matchTimestamp) && (
                        <>
                          <p className="text-gray-300 text-xs mt-1">
                            {formatMatchTime(matchInfo.matchTimestamp)}
                          </p>
                          <div className="border-b border-white/10 mt-2" />
                        </>
                      )}
                      {matchInfo.isWin !== undefined && (
                        <p className={`text-xs font-semibold mt-2 ${matchInfo.isWin ? 'text-green-300' : 'text-red-300'}`}>
                          {matchInfo.isWin ? 'WIN' : 'LOSS'}
                        </p>
                      )}
                    </div>
                  )}
                </div>
                {(mapImageLarge || matchInfo.mapThumbnail) && (
                  <div className="w-40 flex flex-col items-end gap-2">
                    {mapName && (
                      <p className="text-xs font-semibold text-white/90 text-right">
                        {mapName}
                      </p>
                    )}
                    <img
                      src={mapImageLarge || matchInfo.mapThumbnail}
                      alt="Map thumbnail"
                      className="w-48 h-28 rounded-md object-contain bg-black/30"
                      referrerPolicy="no-referrer"
                      data-fallbacks={mapFallbacks.join('|')}
                      onError={(event) => {
                        const target = event.currentTarget
                        const raw = target.dataset.fallbacks || ''
                        const options = raw.split('|').filter(Boolean)
                        const currentIndex = options.indexOf(target.src)
                        const nextIndex = currentIndex === -1 ? 0 : currentIndex + 1
                        const nextUrl = options[nextIndex]
                        if (!loggedMapErrors.has(target.src)) {
                          console.warn('map image failed', {
                            current: target.src,
                            next: nextUrl || null,
                            options
                          })
                          loggedMapErrors.add(target.src)
                        }
                        if (nextUrl && nextUrl !== target.src) {
                          target.src = nextUrl
                        } else {
                          target.onerror = null
                        }
                      }}
                    />
                  </div>
                )}
              </div>
              {matchInfo.matchType && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <p className="text-sm font-semibold text-white/80">
                    {matchInfo.matchType}
                  </p>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default MatchHistory
