import Navbar from './Navbar'
import HeroesList from './HeroesList'

function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="flex flex-col items-center min-h-[calc(100vh-4rem)]">
        <HeroesList />
      </div>
    </div>
  )
}

export default Home

