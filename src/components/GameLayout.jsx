import { useNavigate } from 'react-router-dom'
import { MdArrowBack } from 'react-icons/md'
import { useGame } from '../context/GameContext'
import '../App.css'

function GameLayout({ children, gameTitle }) {
  const navigate = useNavigate()
  const {
    score,
    level,
    health,
    maxHP,
    pokemonData,
    capturedPokemon,
    selectedPokemon,
    setSelectedPokemon,
    showEvolution,
    showDevolution,
    showSwap,
    getHealthColor,
  } = useGame()

  return (
    <>
      <div className="game-layout">
        {/* Left Panel - Pokemon */}
        <div className="pokemon-panel">
          <div className="panel-header">
            <h2 className="panel-title">Your Pokemon</h2>
            <div className="level-badge">Lv {level}</div>
          </div>

          {pokemonData && (
            <>
              <div className="pokemon-display-card">
                <img
                  src={pokemonData.sprites.front_default}
                  alt={pokemonData.name}
                  className="pokemon-sprite-main"
                  style={{
                    filter: (health / maxHP) * 100 < 33 ? 'brightness(0.7) saturate(0.8)' : 'none',
                    animation: (health / maxHP) * 100 < 33 ? 'shake 0.5s infinite' : 'bounce-gentle 2s ease-in-out infinite'
                  }}
                />
                <div className="pokemon-name-main">{pokemonData.name}</div>
              </div>

              <div className="health-section">
                <div className="health-label-row">
                  <span className="health-label">HP</span>
                  <span className="health-text">{health}/{maxHP}</span>
                </div>
                <div className="health-bar-background">
                  <div
                    className="health-bar-fill"
                    style={{
                      width: `${(health / maxHP) * 100}%`,
                      backgroundColor: getHealthColor()
                    }}
                  ></div>
                </div>
              </div>

              <div className="score-display">
                <div className="score-label">Score</div>
                <div className="score-value">{score}</div>
              </div>
            </>
          )}

          {capturedPokemon.length > 0 && (
            <div className="captured-section">
              <div className="captured-header">Captured Pokemon ({capturedPokemon.length})</div>
              <div className="captured-list">
                {capturedPokemon.map((pokemon, index) => (
                  <div
                    key={`${pokemon.id}-${index}`}
                    className="captured-pokemon"
                    onClick={() => setSelectedPokemon(pokemon)}
                  >
                    <img
                      src={pokemon.sprite}
                      alt={pokemon.name}
                      className="captured-sprite"
                    />
                    <div className="captured-pokemon-name">{pokemon.name}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Panel - Game */}
        <div className="game-panel">
          <div className="game-header">
            <h1 className="game-title">{gameTitle}</h1>
            <div className="mode-actions">
              <button
                className="back-button"
                onClick={() => navigate('/')}
              >
                <MdArrowBack /> Back
              </button>
            </div>
          </div>

          {children}
        </div>
      </div>

      {/* Evolution/Devolution/Swap Overlays */}
      {showEvolution && pokemonData && (
        <div className="evolution-overlay">
          <div className="evolution-content">
            <h2 className="evolution-title">Evolution!</h2>
            <img
              src={pokemonData.sprites.front_default}
              alt={pokemonData.name}
              className="evolution-sprite"
            />
            <div className="evolution-text">
              {pokemonData.name} is evolving!
            </div>
          </div>
        </div>
      )}

      {showDevolution && pokemonData && (
        <div className="devolution-overlay">
          <div className="devolution-content">
            <h2 className="devolution-title">Oh no!</h2>
            <img
              src={pokemonData.sprites.front_default}
              alt={pokemonData.name}
              className="devolution-sprite"
            />
            <div className="devolution-text">
              {pokemonData.name} devolved...
            </div>
          </div>
        </div>
      )}

      {showSwap && pokemonData && (
        <div className="swap-overlay">
          <div className="swap-content">
            <h2 className="swap-title">New Adventure!</h2>
            <img
              src={pokemonData.sprites.front_default}
              alt={pokemonData.name}
              className="swap-sprite"
            />
            <div className="swap-text">
              A new Pokemon joins you!
            </div>
          </div>
        </div>
      )}

      {/* Pokemon Detail Modal */}
      {selectedPokemon && (
        <div className="pokemon-detail-overlay" onClick={() => setSelectedPokemon(null)}>
          <div className="pokemon-detail-modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal" onClick={() => setSelectedPokemon(null)}>×</button>
            <div className="pokemon-detail-content">
              <h2 className="pokemon-detail-name">{selectedPokemon.name}</h2>
              <div className="pokemon-detail-id">#{selectedPokemon.id}</div>
              <img
                src={selectedPokemon.sprite}
                alt={selectedPokemon.name}
                className="pokemon-detail-sprite"
              />
              <div className="pokemon-detail-captured">
                Captured on: {new Date(selectedPokemon.capturedAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default GameLayout
