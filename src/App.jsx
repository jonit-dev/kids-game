import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { GameProvider } from './context/GameContext'
import ModeSelection from './components/ModeSelection'
import MathGame from './components/MathGame'
import SpellingGame from './components/SpellingGame'
import MemoryGame from './components/MemoryGame'
import PokemonChess from './components/PokemonChess'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <GameProvider>
        <div className="game-container">
          <Routes>
            <Route path="/" element={<ModeSelection />} />
            <Route path="/math" element={<MathGame />} />
            <Route path="/spelling" element={<SpellingGame />} />
            <Route path="/memory" element={<MemoryGame />} />
            <Route path="/chess" element={<PokemonChess />} />
          </Routes>
        </div>
      </GameProvider>
    </BrowserRouter>
  )
}

export default App
