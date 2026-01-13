import { Link } from 'react-router-dom'
import MarvelRivalsTitle from './MarvelRivalsTitle'

function NotFound() {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-6xl md:text-8xl font-bold text-white mb-4 transform -skew-x-12">
          404
        </h1>
        <h2 className="text-3xl md:text-4xl font-bold text-yellow-400 mb-8 transform -skew-x-12">
          Pagina non trovata
        </h2>
        <p className="text-white text-lg md:text-xl mb-8 max-w-md mx-auto">
          La pagina che stai cercando non esiste o è stata spostata.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            to="/"
            className="px-6 py-3 bg-yellow-400 text-black font-bold rounded-lg hover:bg-yellow-300 transition-colors transform -skew-x-12"
          >
            Torna alla Home
          </Link>
          <Link
            to="/heroes"
            className="px-6 py-3 bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition-colors transform -skew-x-12"
          >
            Vedi tutti gli eroi
          </Link>
        </div>
      </div>
      <div className="mt-12">
        <MarvelRivalsTitle />
      </div>
    </div>
  )
}

export default NotFound
