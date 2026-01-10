import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './components/Home'
import HeroesPage from './pages/HeroesPage'
import SingleHero from './pages/SingleHero'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/heroes" element={<HeroesPage />} />
        <Route path="/hero/:name" element={<SingleHero />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
