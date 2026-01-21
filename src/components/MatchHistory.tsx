import { useEffect } from 'react'
import { useMatchHistory } from '@/hooks/useMatchHistory'
import type { MatchHistoryElement } from '@/lib/matchHistoryTypes'

interface MatchHistoryProps {
  query: string
  season: string
  showHeader?: boolean
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

const formatKd = (kills?: number, deaths?: number) => {
  if (kills === undefined || deaths === undefined) return '-'
  if (deaths === 0) return `${kills.toFixed(1)}`
  return (kills / deaths).toFixed(2)
}

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
  const kills = typeof player.kills === 'number' ? player.kills : undefined
  const deaths = typeof player.deaths === 'number' ? player.deaths : undefined
  const assists = typeof player.assists === 'number' ? player.assists : undefined
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
    kills,
    deaths,
    assists,
    isMvp,
    isSvp,
    mapId: item.match_map_id,
    mapThumbnail: item.map_thumbnail,
  }
}

function MatchHistory({ query, season, showHeader = true }: MatchHistoryProps) {
  const { data, isLoading, error } = useMatchHistory(query, season)
  const matches = data?.match_history ?? []

  useEffect(() => {
    if (!matches || matches.length === 0) return
  }, [matches])

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
      {showHeader && (
        <h3 className="text-xl text-yellow-300 font-semibold mb-4">
          Match history
        </h3>
      )}
      <div className="space-y-4">
        {matches.map((item, index) => {
          const matchInfo = getMatchInfo(item)
          if (!matchInfo) return null
          const title = `Match ${index + 1}`
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
              <div className="flex items-center gap-6">
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
              </div>
              {(matchInfo.kills !== undefined || matchInfo.deaths !== undefined || matchInfo.assists !== undefined) && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-full px-6 flex items-center">
                    <div className="flex-1" />
                    <div className="grid grid-cols-3 gap-6 text-center">
                      <div>
                        <span className="text-[10px] uppercase tracking-wide text-white/60">Kill</span>
                        <p className="text-base md:text-lg font-semibold text-white/80">
                          {matchInfo.kills ?? '-'}
                        </p>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase tracking-wide text-white/60">Death</span>
                        <p className="text-base md:text-lg font-semibold text-white/80">
                          {matchInfo.deaths ?? '-'}
                        </p>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase tracking-wide text-white/60">Assist</span>
                        <p className="text-base md:text-lg font-semibold text-white/80">
                          {matchInfo.assists ?? '-'}
                        </p>
                      </div>
                    </div>
                    <div className="flex-1 flex justify-end">
                      <div className="text-right">
                        <span className="text-xs uppercase tracking-wide text-white/60">KD</span>
                        <p className="text-lg md:text-2xl font-semibold text-white/90">
                          {formatKd(matchInfo.kills, matchInfo.deaths)}
                        </p>
                      </div>
                    </div>
                  </div>
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
