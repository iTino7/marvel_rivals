import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './components/Home'
import HeroesPage from './pages/HeroesPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/heroes" element={<HeroesPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
