import { Link } from 'react-router-dom'

function MarvelRivalsTitle() {
  return (
    <Link to="/" className="cursor-pointer hover:opacity-80 transition-opacity">
      <h1 className="text-3xl md:text-4xl font-bold text-white transform -skew-x-12 whitespace-nowrap">
        Marvel Rivals
      </h1>
    </Link>
  )
}

export default MarvelRivalsTitle
