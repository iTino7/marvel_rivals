import ThemeToggle from './ThemeToggle'

function Navbar() {
  return (
    <nav className="bg-white dark:bg-black">
      <div className="flex justify-between items-center h-16 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Marvel Rivals</h1>
        </div>
        <div className="flex items-center space-x-4">
          <a 
            href="#vanguard" 
            onClick={(e) => {
              e.preventDefault()
              const element = document.getElementById('vanguard')
              element?.scrollIntoView({ behavior: 'smooth', block: 'start' })
            }}
            className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium"
          >
            Vanguard
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
            Duelist
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
            Strategist
          </a>
          <ThemeToggle />
        </div>
      </div>
    </nav>
  )
}

export default Navbar

