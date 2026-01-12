import { Link } from 'react-router-dom'
import ThemeToggle from './ThemeToggle'
import SearchInput from './SearchInput'
import { NavbarStrings } from '@/lib/strings'

interface NavbarProps {
  searchValue: string
  onSearchChange: (value: string) => void
}

function Navbar({ searchValue, onSearchChange }: NavbarProps) {
  return (
    <nav className="bg-white dark:bg-black relative">
      <div className="flex justify-center md:justify-between items-center h-16 px-4 sm:px-6 lg:px-8 gap-4">
        <div className="flex items-center">
          <Link to="/" className="text-xl font-bold text-gray-900 dark:text-white hover:opacity-80 transition-opacity">
            {NavbarStrings.marvelRivals}
          </Link>
        </div>
        <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-full max-w-md px-4">
          <SearchInput value={searchValue} onChange={onSearchChange} />
        </div>
        <div className="hidden md:flex items-center space-x-4 ml-auto">
          <a 
            href="#vanguard" 
            onClick={(e) => {
              e.preventDefault()
              const element = document.getElementById('vanguard')
              element?.scrollIntoView({ behavior: 'smooth', block: 'start' })
            }}
            className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium"
          >
            {NavbarStrings.vanguard}
          </a>
          <a 
            href="#duelist"
            onClick={(e) => {
              e.preventDefault()
              const element = document.getElementById('duelist')
              element?.scrollIntoView({ behavior: 'smooth', block: 'start' })
            }}
            className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium"
          >
            {NavbarStrings.duelist}
          </a>
          <a 
            href="#strategist"
            onClick={(e) => {
              e.preventDefault()
              const element = document.getElementById('strategist')
              element?.scrollIntoView({ behavior: 'smooth', block: 'start' })
            }}
            className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium"
          >
            {NavbarStrings.strategist}
          </a>
          <ThemeToggle />
        </div>
      </div>
    </nav>
  )
}

export default Navbar

