import MarvelRivalsTitle from '@/components/MarvelRivalsTitle'
import PlayerStats from '@/components/PlayerStats'

function PlayerStatsPage() {
  return (
    <div className="relative h-screen overflow-hidden bg-black">
      <div className="relative z-10">
        <nav className="bg-black border-b border-white/10">
          <div className="flex justify-between items-center h-16 px-4 sm:px-6 lg:px-8">
            <MarvelRivalsTitle />
          </div>
        </nav>
        <main className="h-[calc(100vh-4rem)] overflow-y-auto">
          <PlayerStats />
        </main>
      </div>
    </div>
  )
}

export default PlayerStatsPage
