import { useState } from 'react'
import Navbar from './Navbar'
import HeroesList from './HeroesList'

function Home() {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div className="min-h-screen">
      <Navbar searchValue={searchQuery} onSearchChange={setSearchQuery} />
      <div className="flex flex-col items-center min-h-[calc(100vh-4rem)]">
        <HeroesList searchQuery={searchQuery} />
      </div>
    </div>
  )
}

export default Home

