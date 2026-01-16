import { useEffect, useMemo } from 'react'
import { useMapNames } from '@/hooks/useMapNames'
import { usePlayerStats } from '@/hooks/usePlayerStats'
import type { Stats } from '@/lib/playerStatsTypes'

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

const isPrimitive = (value: unknown): value is string | number | boolean => {
  return ['string', 'number', 'boolean'].includes(typeof value)
}

const isMatchHistoryKey = (key: string): boolean => {
  const normalized = key.toLowerCase().replace(/_/g, '')
  return normalized === 'matchhistory'
}

const getPlayerSummary = (
  payload: Stats | null
): {
  name?: string
  level?: string | number
  iconPath?: string
  rankImage?: string
  lastOnline?: string
  uid?: number
} | null => {
  if (!payload || !isRecord(payload.player)) return null
  const player = payload.player as Record<string, unknown>
  const name = typeof player.name === 'string' ? player.name : undefined
  const uid = typeof player.uid === 'number' ? player.uid : undefined
  let iconPath: string | undefined
  if (isRecord(player.icon) && typeof player.icon.player_icon === 'string') {
    iconPath = player.icon.player_icon
  }
  let rankImage: string | undefined
  if (isRecord(player.rank) && typeof player.rank.image === 'string') {
    rankImage = player.rank.image
  }
  let lastOnline: string | undefined
  if (payload.updates && typeof payload.updates.info_update_time === 'string') {
    lastOnline = payload.updates.info_update_time
  } else if (payload.updates && typeof payload.updates.last_update_request === 'string') {
    lastOnline = payload.updates.last_update_request
  }
  const levelKeys = ['level', 'player_level', 'account_level']
  let level: string | number | undefined
  for (const key of levelKeys) {
    const value = player[key]
    if (isPrimitive(value) && typeof value !== 'boolean') {
      level = value
      break
    }
  }
  if (!name && level === undefined && !iconPath && !rankImage && !lastOnline && uid === undefined) return null
  return { name, level, iconPath, rankImage, lastOnline, uid }
}

const getPlayerIconSrc = (iconPath?: string): string | null => {
  if (!iconPath) return null
  if (iconPath.startsWith('http://') || iconPath.startsWith('https://')) {
    return iconPath
  }
  return `https://marvelrivalsapi.com/rivals${iconPath}`
}

const getPlayerRankSrc = (rankPath?: string): string | null => {
  if (!rankPath) return null
  if (rankPath.startsWith('http://') || rankPath.startsWith('https://')) {
    return rankPath
  }
  return `https://marvelrivalsapi.com/rivals${rankPath}`
}

const getHeroIconSrc = (iconPath?: string): string | null => {
  if (!iconPath) return null
  if (iconPath.startsWith('http://') || iconPath.startsWith('https://')) {
    return iconPath
  }
  return `https://marvelrivalsapi.com/rivals${iconPath}`
}

const getPlayerMatchInfo = (
  item: Record<string, unknown>,
  playerUid?: number,
  mapName?: string
) => {
  if (!isRecord(item.player_performance)) {
    return null
  }
  const performance = item.player_performance as Record<string, unknown>
  const heroIcon = typeof performance.hero_type === 'string' ? performance.hero_type : undefined
  const heroName = typeof performance.hero_name === 'string' ? performance.hero_name : undefined
  const matchTimestamp = typeof item.match_time_stamp === 'number' ? item.match_time_stamp : undefined
  const mapThumbnail = typeof item.map_thumbnail === 'string' ? item.map_thumbnail : undefined
  const isWin = isRecord(performance.is_win)
    ? Boolean((performance.is_win as Record<string, unknown>).is_win)
    : undefined
  const matchType = typeof performance.score_change === 'number' ||
    typeof performance.new_score === 'number' ||
    typeof performance.new_level === 'number'
    ? 'Competitive'
    : 'Quick Match'
  const isMvp = typeof item.mvp_uid === 'number' && playerUid !== undefined
    ? item.mvp_uid === playerUid
    : false
  const isSvp = typeof item.svp_uid === 'number' && playerUid !== undefined
    ? item.svp_uid === playerUid
    : false
  return {
    heroIcon,
    heroName,
    matchTimestamp,
    isWin,
    isMvp,
    isSvp,
    matchType,
    mapThumbnail,
    mapName
  }
}

const getMapThumbnailSrc = (thumbnailPath?: string): string | null => {
  if (!thumbnailPath) return null
  if (thumbnailPath.startsWith('http://') || thumbnailPath.startsWith('https://')) {
    return thumbnailPath
  }
  return `https://marvelrivalsapi.com/rivals${thumbnailPath}`
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

const normalizePayload = (payload: unknown): Stats | null => {
  if (isRecord(payload)) return payload as Stats
  if (Array.isArray(payload) && payload.length > 0 && isRecord(payload[0])) {
    return payload[0] as Stats
  }
  return null
}

interface PlayerStatsProps {
  query: string
}

function PlayerStats({ query }: PlayerStatsProps) {
  const { data, isLoading, error } = usePlayerStats(query)
  const normalizedData = useMemo(() => normalizePayload(data), [data])
  const mapIds = useMemo(() => {
    if (!normalizedData?.match_history) return []
    return normalizedData.match_history
      .map((match) => (typeof match.map_id === 'number' ? match.map_id : null))
      .filter((id): id is number => id !== null)
  }, [normalizedData])
  const { data: mapNames } = useMapNames(mapIds)
  const playerSummary = useMemo(() => getPlayerSummary(normalizedData), [normalizedData])
  const hasData = Boolean(normalizedData)

  useEffect(() => {
    const iconSrc = getPlayerIconSrc(playerSummary?.iconPath || undefined)
    if (iconSrc) {
      console.log(iconSrc)
    }
  }, [playerSummary?.iconPath])

  return (
    <div className="relative min-h-full w-full overflow-hidden">
      <div className="relative z-10 w-full py-10 px-6">
        {!query && (
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
              <div className="mb-8 border-2 border-yellow-400/20 rounded-md p-6 w-full flex items-center gap-4">
                {getPlayerIconSrc(playerSummary.iconPath) && (
                  <div className="relative">
                    <img
                      src={getPlayerIconSrc(playerSummary.iconPath) as string}
                      alt="Player icon"
                      className="w-24 h-24 rounded-md object-cover border border-yellow-400/30"
                    />
                    {playerSummary.level !== undefined && (
                      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-black/80 text-yellow-300 text-xs font-semibold px-2 py-0.5 rounded-md border border-yellow-400/40">
                        {playerSummary.level}
                      </div>
                    )}
                  </div>
                )}
                <div>
                  {(playerSummary.name || playerSummary.rankImage) && (
                    <div className="flex items-center gap-3">
                      {playerSummary.name && (
                        <p className="text-white text-2xl md:text-3xl font-semibold">
                          {playerSummary.name}
                        </p>
                      )}
                      {getPlayerRankSrc(playerSummary.rankImage) && (
                        <img
                          src={getPlayerRankSrc(playerSummary.rankImage) as string}
                          alt="Rank icon"
                          className="h-8 w-8 object-contain"
                        />
                      )}
                    </div>
                  )}
                  {playerSummary.lastOnline && (
                    <p className="text-gray-300 text-sm mt-2">
                      Last online {playerSummary.lastOnline}
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
                  <div key={key} className="max-w-3xl mx-auto">
                    <h3 className="text-xl text-yellow-300 font-semibold mb-4">
                      {key.replace(/_/g, ' ')}
                    </h3>
                    <div className="space-y-4">
                      {items.map((item, index) => {
                        const mapId = typeof item.map_id === 'number' ? item.map_id : undefined
                        const mapName = mapId !== undefined ? mapNames?.get(mapId) : undefined
                        if (mapName) {
                          console.log(mapName)
                        } else if (playerSummary?.uid !== undefined) {
                          console.log(playerSummary.uid)
                        }
                        const matchInfo = getPlayerMatchInfo(item, playerSummary?.uid, mapName)
                        if (!matchInfo) return null
                        const title = `Match ${index + 1}`
                        return (
                          <div key={`${key}-${index}`} className="relative border-2 border-yellow-400/20 rounded-md p-4">
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
                              {getMapThumbnailSrc(matchInfo.mapThumbnail) && (
                                <div className="w-40 flex flex-col items-end gap-2">
                                  {matchInfo.mapName ? (
                                    <p className="text-xs font-semibold text-white/90 text-right">
                                      {matchInfo.mapName}
                                    </p>
                                  ) : mapId !== undefined ? (
                                    <p className="text-xs font-semibold text-white/70 text-right">
                                      {mapId}
                                    </p>
                                  ) : null}
                                  <img
                                    src={getMapThumbnailSrc(matchInfo.mapThumbnail) as string}
                                    alt="Map thumbnail"
                                    className="w-48 h-28 rounded-md object-contain bg-black/30"
                                    data-fallback={matchInfo.mapThumbnail ? `https://marvelrivalsapi.com${matchInfo.mapThumbnail}` : undefined}
                                    onError={(event) => {
                                      const target = event.currentTarget
                                      const fallback = target.dataset.fallback
                                      if (fallback && target.src !== fallback) {
                                        target.src = fallback
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
              })}
          </div>
        )}
      </div>
    </div>
  )
}

export default PlayerStats
