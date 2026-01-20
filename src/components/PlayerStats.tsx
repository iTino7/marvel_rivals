import { useMemo, useState } from 'react'
import { usePlayerStats } from '@/hooks/usePlayerStats'
import MatchHistory from '@/components/MatchHistory'
import type { Stats } from '@/lib/playerStatsTypes'

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

const isPrimitive = (value: unknown): value is string | number | boolean => {
  return ['string', 'number', 'boolean'].includes(typeof value)
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
  const [season, setSeason] = useState('5.5')
  const normalizedData = useMemo(() => normalizePayload(data), [data])
  const playerSummary = useMemo(() => getPlayerSummary(normalizedData), [normalizedData])
  const hasData = Boolean(normalizedData)

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
            <div className="max-w-3xl mx-auto flex items-center justify-between gap-4 mb-4">
              <h3 className="text-xl text-yellow-300 font-semibold">
                Match history
              </h3>
              <label className="flex items-center gap-2 text-sm text-white/80">
                Season
                <select
                  value={season}
                  onChange={(event) => setSeason(event.target.value)}
                  className="bg-black/40 text-white border border-yellow-400/20 rounded-md px-3 py-1 text-sm"
                >
                  <option value="6">6</option>
                  <option value="5.5">5.5</option>
                  <option value="5">5</option>
                  <option value="4.5">4.5</option>
                  <option value="4">4</option>
                  <option value="3.5">3.5</option>
                  <option value="3">3</option>
                  <option value="2.5">2.5</option>
                  <option value="2">2</option>
                  <option value="1.5">1.5</option>
                  <option value="1">1</option>
                </select>
              </label>
            </div>
            <MatchHistory query={query} season={season} showHeader={false} />
          </div>
        )}
      </div>
    </div>
  )
}

export default PlayerStats
