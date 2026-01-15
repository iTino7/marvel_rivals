import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './components/Home'
import HeroesPage from './pages/HeroesPage'
import SingleHeroWithTransition from './components/SingleHeroWithTransition'
import NotFound from './components/NotFound'
import PlayerStatsPage from './pages/PlayerStatsPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/heroes" element={<HeroesPage />} />
        <Route path="/hero/:name" element={<SingleHeroWithTransition />} />
        <Route path="/player-stats" element={<PlayerStatsPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
