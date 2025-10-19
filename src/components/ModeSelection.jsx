import { useNavigate } from 'react-router-dom'
import '../App.css'

function ModeSelection() {
  const navigate = useNavigate()

  const handleModeSelection = (mode) => {
    navigate(`/${mode}`)
  }

  return (
    <div className="mode-selection-screen">
      <h1 className="selection-title">Choose Your Adventure!</h1>
      <div className="mode-cards">
        <div className="mode-card" onClick={() => handleModeSelection('math')}>
          <div className="mode-card-icon">123</div>
          <h2 className="mode-card-title">Math Adventure</h2>
          <p className="mode-card-description">Practice addition, subtraction, multiplication, and division with visual aids!</p>
        </div>
        <div className="mode-card" onClick={() => handleModeSelection('spelling')}>
          <div className="mode-card-icon">ABC</div>
          <h2 className="mode-card-title">Spelling Adventure</h2>
          <p className="mode-card-description">Learn to spell words with audio hints and visual clues!</p>
        </div>
        <div className="mode-card" onClick={() => handleModeSelection('memory')}>
          <div className="mode-card-icon">🧠</div>
          <h2 className="mode-card-title">Memory Game</h2>
          <p className="mode-card-description">Find matching pairs and train your memory skills!</p>
        </div>
        <div className="mode-card" onClick={() => handleModeSelection('chess')}>
          <div className="mode-card-icon">♟️</div>
          <h2 className="mode-card-title">Pokemon Chess</h2>
          <p className="mode-card-description">Play chess with Pokemon pieces! Capture opponent pieces to gain HP and evolve!</p>
        </div>
      </div>
    </div>
  )
}

export default ModeSelection
