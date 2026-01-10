import { useParams } from 'react-router-dom'
import { useHeroes } from '@/hooks/useHeroes'

function SingleHero() {
  const { name } = useParams<{ name: string }>()
  const { data: heroes, isLoading } = useHeroes()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-white text-xl">Caricamento...</div>
      </div>
    )
  }

  const decodedName = name ? decodeURIComponent(name) : ''
  const hero = heroes?.find(h => h.name === decodedName)

  if (!hero) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-white text-xl">Personaggio non trovato</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <h1 className="text-6xl md:text-8xl font-bold text-white">
        {hero.name}
      </h1>
    </div>
  )
}

export default SingleHero
