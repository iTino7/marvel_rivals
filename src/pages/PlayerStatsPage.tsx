import { useState, type FormEvent } from 'react'
import MarvelRivalsTitle from '@/components/MarvelRivalsTitle'
import PlayerStats from '@/components/PlayerStats'
import { Input } from '@/components/ui/input'

function PlayerStatsPage() {
  const [searchValue, setSearchValue] = useState('')
  const [submittedValue, setSubmittedValue] = useState('')
  const hasSearched = Boolean(submittedValue)

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    const trimmedValue = searchValue.trim()
    if (!trimmedValue) return
    setSubmittedValue(trimmedValue)
    setSearchValue('')
  }

  return (
    <div className="relative min-h-screen bg-black">
      <div className="relative z-20">
        <nav className="fixed top-0 inset-x-0 bg-black border-b border-white/10 z-30">
          <div className="relative flex items-center h-16 px-4 sm:px-6 lg:px-8">
            <MarvelRivalsTitle />
            {hasSearched && (
              <>
                <div className="absolute left-1/2 -translate-x-1/2 w-56 md:w-64">
                  <form onSubmit={handleSubmit}>
                    <Input
                      placeholder="Cerca giocatore..."
                      className="text-white placeholder:text-gray-400 font-['Rajdhani'] font-semibold"
                      value={searchValue}
                      onChange={(event) => setSearchValue(event.target.value)}
                    />
                  </form>
                </div>
                <h2 className="ml-auto text-2xl md:text-3xl font-bold text-[#fbdb2b] transform -skew-x-12">
                  Player Stats
                </h2>
              </>
            )}
          </div>
        </nav>
        <div className="fixed inset-x-0 top-16 bottom-0 bg-neutral-900 pointer-events-none z-0" />
        <main className="relative z-10 min-h-[calc(100vh-4rem)] pt-16">
          <div>
            {!hasSearched && (
              <div className="w-full py-10 px-6">
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
              </div>
            )}
            <PlayerStats query={submittedValue} />
          </div>
        </main>
      </div>
    </div>
  )
}

export default PlayerStatsPage
