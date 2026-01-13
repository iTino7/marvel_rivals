import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './components/Home'
import HeroesPage from './pages/HeroesPage'
import SingleHero from './pages/SingleHero'
import NotFound from './components/NotFound'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/heroes" element={<HeroesPage />} />
        <Route path="/hero/:name" element={<SingleHero />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
