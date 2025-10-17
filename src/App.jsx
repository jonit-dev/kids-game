import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [num1, setNum1] = useState(0)
  const [num2, setNum2] = useState(0)
  const [operation, setOperation] = useState('+')
  const [answer, setAnswer] = useState('')
  const [score, setScore] = useState(0)
  const [message, setMessage] = useState('Let\'s learn math!')
  const [showCelebration, setShowCelebration] = useState(false)
  const [currentEmoji, setCurrentEmoji] = useState('🍎')
  const [currentQuestionDifficulty, setCurrentQuestionDifficulty] = useState('easy')
  const [level, setLevel] = useState(1)
  const [health, setHealth] = useState(50) // Health bar instead of XP (0-100)
  const [pokemonStage, setPokemonStage] = useState(0)
  const [showEvolution, setShowEvolution] = useState(false)
  const [showDevolution, setShowDevolution] = useState(false)
  const [pokemonData, setPokemonData] = useState(null)

  // Pokemon evolution chains - using PokeAPI IDs
  const evolutionChains = [
    { name: 'Squirtle', stages: [7, 8, 9] },      // Squirtle -> Wartortle -> Blastoise
    { name: 'Charmander', stages: [4, 5, 6] },    // Charmander -> Charmeleon -> Charizard
    { name: 'Bulbasaur', stages: [1, 2, 3] },     // Bulbasaur -> Ivysaur -> Venusaur
    { name: 'Pikachu', stages: [172, 25, 26] },   // Pichu -> Pikachu -> Raichu
    { name: 'Eevee', stages: [133, 134, 135] }    // Eevee -> Vaporeon -> Jolteon
  ]

  const [currentChain] = useState(evolutionChains[Math.floor(Math.random() * evolutionChains.length)])

  const getHealthColor = () => {
    if (health > 66) return '#4ECDC4' // Teal - healthy
    if (health > 33) return '#FFD93D' // Yellow - warning
    return '#FF6B6B' // Red - danger
  }

  const encouragementMessages = [
    'Great job!',
    'You\'re awesome!',
    'Fantastic!',
    'Amazing work!',
    'You\'re a math star!',
    'Perfect!',
    'Brilliant!',
    'Super smart!'
  ]

  // Visual representations - fun objects for kids to count
  const visualObjects = [
    '🍎', '🍌', '🍊', '🍇', '🍓',
    '⚽', '🎈', '⭐', '🌸', '🦋',
    '🐠', '🐢', '🐶', '🐱', '🐰'
  ]

  const VisualCounter = ({ count, crossOut = false }) => {
    return (
      <div className="visual-counter">
        {[...Array(count)].map((_, i) => (
          <span
            key={i}
            className={`visual-object ${crossOut ? 'crossed-out' : ''}`}
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            {currentEmoji}
          </span>
        ))}
      </div>
    )
  }

  const getDifficultyRanges = (op, diff) => {
    const ranges = {
      '+': {
        easy: { n1: [1, 5], n2: [1, 5] },
        medium: { n1: [5, 10], n2: [5, 10] },
        hard: { n1: [10, 20], n2: [10, 20] }
      },
      '-': {
        easy: { n1: [3, 7], n2: [1, 3] },
        medium: { n1: [8, 15], n2: [3, 8] },
        hard: { n1: [15, 30], n2: [5, 15] }
      },
      '×': {
        easy: { n1: [2, 3], n2: [2, 3] },      // 2×2, 2×3, 3×2, 3×3
        medium: { n1: [2, 4], n2: [2, 4] },    // up to 4×4
        hard: { n1: [2, 5], n2: [2, 5] }       // up to 5×5
      },
      '÷': {
        easy: { n1: [2, 2], n2: [2, 2] },      // simple like 4÷2, 6÷2
        medium: { n1: [2, 3], n2: [2, 3] },    // up to 9÷3
        hard: { n1: [2, 4], n2: [2, 4] }       // up to 16÷4
      }
    }
    return ranges[op][diff]
  }

  const getScoreForDifficulty = (diff) => {
    return { easy: 1, medium: 2, hard: 3 }[diff]
  }

  const getOperationsForDifficulty = (diff) => {
    // Easy: addition and subtraction
    // Medium: add multiplication
    // Hard: all operations
    const ops = {
      easy: ['+', '-'],
      medium: ['+', '-', '×'],
      hard: ['+', '-', '×', '÷']
    }
    return ops[diff]
  }

  const fetchPokemon = async (pokemonId) => {
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`)
      const data = await response.json()
      setPokemonData(data)
      console.log('Pokemon loaded:', data.name)
    } catch (error) {
      console.error('Error fetching Pokemon:', error)
    }
  }

  const generateProblem = () => {
    // Randomly pick a difficulty for this question
    const difficulties = ['easy', 'medium', 'hard']
    const randomDifficulty = difficulties[Math.floor(Math.random() * difficulties.length)]
    setCurrentQuestionDifficulty(randomDifficulty)

    const availableOps = getOperationsForDifficulty(randomDifficulty)
    const newOp = availableOps[Math.floor(Math.random() * availableOps.length)]
    const range = getDifficultyRanges(newOp, randomDifficulty)

    let n1, n2

    if (newOp === '÷') {
      // For division, ensure clean division
      n2 = Math.floor(Math.random() * (range.n2[1] - range.n2[0] + 1)) + range.n2[0]
      const multiplier = Math.floor(Math.random() * (range.n1[1] - range.n1[0] + 1)) + range.n1[0]
      n1 = n2 * multiplier
    } else if (newOp === '-') {
      n1 = Math.floor(Math.random() * (range.n1[1] - range.n1[0] + 1)) + range.n1[0]
      n2 = Math.floor(Math.random() * Math.min(n1, range.n2[1])) + range.n2[0]
      n2 = Math.min(n2, n1) // Ensure no negative results
    } else {
      n1 = Math.floor(Math.random() * (range.n1[1] - range.n1[0] + 1)) + range.n1[0]
      n2 = Math.floor(Math.random() * (range.n2[1] - range.n2[0] + 1)) + range.n2[0]
    }

    // Pick a random emoji for this problem
    const randomEmoji = visualObjects[Math.floor(Math.random() * visualObjects.length)]
    setCurrentEmoji(randomEmoji)

    setNum1(n1)
    setNum2(n2)
    setOperation(newOp)
    setAnswer('')
    setMessage('Try this one!')
  }

  useEffect(() => {
    console.log('Loading initial Pokemon, chain:', currentChain.name, 'stage:', pokemonStage, 'ID:', currentChain.stages[pokemonStage])
    generateProblem()
    fetchPokemon(currentChain.stages[pokemonStage])
  }, [])

  const handleCorrectAnswer = () => {
    const newHealth = Math.min(100, health + 15) // Increase health by 15, max 100
    setHealth(newHealth)

    // Evolve when health reaches 100 and not at max stage
    if (newHealth === 100 && pokemonStage < currentChain.stages.length - 1) {
      const newStage = pokemonStage + 1
      setPokemonStage(newStage)
      setHealth(50) // Reset health to 50 after evolution
      setShowEvolution(true)

      setTimeout(() => {
        fetchPokemon(currentChain.stages[newStage])
        setTimeout(() => {
          setShowEvolution(false)
        }, 3000)
      }, 500)
    }
  }

  const handleWrongAnswer = () => {
    const newHealth = Math.max(0, health - 20) // Decrease health by 20, min 0
    setHealth(newHealth)

    // Devolve when health reaches 0 and not at first stage
    if (newHealth === 0 && pokemonStage > 0) {
      const newStage = pokemonStage - 1
      setPokemonStage(newStage)
      setHealth(50) // Reset health to 50 after devolution
      setShowDevolution(true)

      setTimeout(() => {
        fetchPokemon(currentChain.stages[newStage])
        setTimeout(() => {
          setShowDevolution(false)
        }, 3000)
      }, 500)
    }
  }

  const checkAnswer = () => {
    let correctAnswer
    switch (operation) {
      case '+': correctAnswer = num1 + num2; break
      case '-': correctAnswer = num1 - num2; break
      case '×': correctAnswer = num1 * num2; break
      case '÷': correctAnswer = num1 / num2; break
      default: correctAnswer = 0
    }

    const userAnswer = parseInt(answer)

    if (userAnswer === correctAnswer) {
      const randomMessage = encouragementMessages[Math.floor(Math.random() * encouragementMessages.length)]
      const points = getScoreForDifficulty(currentQuestionDifficulty)
      setMessage(`${randomMessage} +${points} pts!`)
      setScore(score + points)
      handleCorrectAnswer()
      setShowCelebration(true)

      setTimeout(() => {
        setShowCelebration(false)
        generateProblem()
      }, 1500)
    } else {
      setMessage('Oops! Wrong answer!')
      handleWrongAnswer()
      setAnswer('')
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && answer !== '') {
      checkAnswer()
    }
  }

  return (
    <div className="game-container">
      <div className="top-bar">
        <h1 className="title">Math Adventure</h1>
        <div className="stats-badges">
          <div className="level-badge-small">Lv {level}</div>
          <div className="score-badge-small">{score}</div>
        </div>
      </div>

      {pokemonData && (
        <div className="pokemon-hero">
          <img
            src={pokemonData.sprites.front_default}
            alt={pokemonData.name}
            className="pokemon-sprite-hero"
            style={{
              filter: health < 33 ? 'brightness(0.7) saturate(0.8)' : 'none',
              animation: health < 33 ? 'shake 0.5s infinite' : 'bounce-gentle 2s ease-in-out infinite'
            }}
          />
          <div className="pokemon-status">
            <div className="pokemon-name-hero">{pokemonData.name}</div>
            <div className="health-bar-container">
              <div className="health-label">HP</div>
              <div className="health-bar-background">
                <div
                  className="health-bar-fill"
                  style={{
                    width: `${health}%`,
                    backgroundColor: getHealthColor()
                  }}
                ></div>
              </div>
              <div className="health-text">{health}/100</div>
            </div>
          </div>
        </div>
      )}

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

      <div className="game-content">
        <div className={`message ${showCelebration ? 'celebration' : ''}`}>
          {message}
        </div>

        <div className="problem-container">
          {operation === '+' ? (
            <div className="visual-problem">
              <div className="visual-group">
                <span className="number">{num1}</span>
                <VisualCounter count={num1} />
              </div>

              <span className="operator">{operation}</span>

              <div className="visual-group">
                <span className="number">{num2}</span>
                <VisualCounter count={num2} />
              </div>

              <span className="equals">=</span>
              <span className="question">?</span>
            </div>
          ) : operation === '-' ? (
            <div className="visual-problem subtraction">
              <div className="operation-explanation">
                Start with <strong>{num1}</strong> {currentEmoji}, then take away <strong>{num2}</strong> {currentEmoji}
              </div>
              <div className="visual-group-full">
                <div className="visual-counter-subtraction">
                  {[...Array(num1)].map((_, i) => (
                    <span
                      key={i}
                      className={`visual-object ${i >= num1 - num2 ? 'crossed-out' : ''}`}
                      style={{ animationDelay: `${i * 0.1}s` }}
                    >
                      {currentEmoji}
                    </span>
                  ))}
                </div>
                <div className="operation-math">
                  <span className="number">{num1}</span>
                  <span className="operator">{operation}</span>
                  <span className="number">{num2}</span>
                  <span className="equals">=</span>
                  <span className="question">?</span>
                </div>
              </div>
            </div>
          ) : operation === '×' ? (
            <div className="visual-problem multiplication">
              <div className="operation-explanation">
                <strong>{num1}</strong> rows × <strong>{num2}</strong> columns = <strong>{num1 * num2}</strong> {currentEmoji}
              </div>
              <div className="visual-group-full">
                <div className="multiplication-array">
                  {[...Array(num1)].map((_, rowIdx) => (
                    <div key={rowIdx} className="multiplication-row" style={{ animationDelay: `${rowIdx * 0.1}s` }}>
                      {[...Array(num2)].map((_, colIdx) => (
                        <span
                          key={colIdx}
                          className="visual-object-mult"
                          style={{ animationDelay: `${(rowIdx * 0.1) + (colIdx * 0.05)}s` }}
                        >
                          {currentEmoji}
                        </span>
                      ))}
                    </div>
                  ))}
                </div>
                <div className="operation-math">
                  <span className="number">{num1}</span>
                  <span className="operator">{operation}</span>
                  <span className="number">{num2}</span>
                  <span className="equals">=</span>
                  <span className="question">?</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="visual-problem division">
              <div className="operation-explanation">
                Divide <strong>{num1}</strong> {currentEmoji} into <strong>{num2}</strong> equal groups
              </div>
              <div className="visual-group-full">
                <div className="division-container">
                  {[...Array(num2)].map((_, groupIdx) => (
                    <div key={groupIdx} className="division-circle" style={{ animationDelay: `${groupIdx * 0.15}s` }}>
                      <div className="circle-label">{groupIdx + 1}</div>
                      <div className="circle-items">
                        {[...Array(num1 / num2)].map((_, itemIdx) => (
                          <span
                            key={itemIdx}
                            className="visual-object-div"
                            style={{ animationDelay: `${(groupIdx * 0.15) + (itemIdx * 0.1)}s` }}
                          >
                            {currentEmoji}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="operation-math">
                  <span className="number">{num1}</span>
                  <span className="operator">{operation}</span>
                  <span className="number">{num2}</span>
                  <span className="equals">=</span>
                  <span className="question">?</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="answer-section">
          <input
            type="number"
            className="answer-input"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type answer"
            autoFocus
          />
          <button
            className="submit-button"
            onClick={checkAnswer}
            disabled={answer === ''}
          >
            Check Answer
          </button>
        </div>

        <button className="skip-button" onClick={generateProblem}>
          Skip to Next
        </button>
      </div>

      {showCelebration && (
        <div className="confetti">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="confetti-piece" style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 0.5}s`,
              backgroundColor: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#FFD93D'][Math.floor(Math.random() * 6)]
            }}></div>
          ))}
        </div>
      )}
    </div>
  )
}

export default App
