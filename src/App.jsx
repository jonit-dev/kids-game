import { useState, useEffect } from 'react'
import { MdSkipNext } from 'react-icons/md'
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
  const [health, setHealth] = useState(0) // Health bar starts at 0 (0-maxHP)
  const [pokemonStage, setPokemonStage] = useState(0)
  const [showEvolution, setShowEvolution] = useState(false)
  const [showDevolution, setShowDevolution] = useState(false)
  const [showSwap, setShowSwap] = useState(false)
  const [pokemonData, setPokemonData] = useState(null)
  const [selectedPokemon, setSelectedPokemon] = useState(null)
  const [capturedPokemon, setCapturedPokemon] = useState(() => {
    const saved = localStorage.getItem('capturedPokemon')
    return saved ? JSON.parse(saved) : []
  })
  const [maxHP, setMaxHP] = useState(50) // Exponentially increasing HP requirement
  const [isProcessingAnswer, setIsProcessingAnswer] = useState(false) // Prevent multiple submissions

  // Pokemon evolution chains - using PokeAPI IDs
  const evolutionChains = [
    // Gen 1 Starters
    { name: 'Squirtle', stages: [7, 8, 9] },      // Squirtle -> Wartortle -> Blastoise
    { name: 'Charmander', stages: [4, 5, 6] },    // Charmander -> Charmeleon -> Charizard
    { name: 'Bulbasaur', stages: [1, 2, 3] },     // Bulbasaur -> Ivysaur -> Venusaur

    // Pikachu Line
    { name: 'Pikachu', stages: [172, 25, 26] },   // Pichu -> Pikachu -> Raichu

    // Eevee Evolutions (multiple chains for variety)
    { name: 'Eevee-Vaporeon', stages: [133, 134, 196] },   // Eevee -> Vaporeon -> Espeon
    { name: 'Eevee-Jolteon', stages: [133, 135, 197] },    // Eevee -> Jolteon -> Umbreon
    { name: 'Eevee-Flareon', stages: [133, 136, 470] },    // Eevee -> Flareon -> Leafeon

    // Gen 1 Popular Pokemon
    { name: 'Geodude', stages: [74, 75, 76] },    // Geodude -> Graveler -> Golem
    { name: 'Abra', stages: [63, 64, 65] },       // Abra -> Kadabra -> Alakazam
    { name: 'Machop', stages: [66, 67, 68] },     // Machop -> Machoke -> Machamp
    { name: 'Gastly', stages: [92, 93, 94] },     // Gastly -> Haunter -> Gengar
    { name: 'Dratini', stages: [147, 148, 149] }, // Dratini -> Dragonair -> Dragonite
    { name: 'Oddish', stages: [43, 44, 45] },     // Oddish -> Gloom -> Vileplume
    { name: 'Poliwag', stages: [60, 61, 62] },    // Poliwag -> Poliwhirl -> Poliwrath
    { name: 'Bellsprout', stages: [69, 70, 71] }, // Bellsprout -> Weepinbell -> Victreebel

    // Gen 2 Starters
    { name: 'Chikorita', stages: [152, 153, 154] }, // Chikorita -> Bayleef -> Meganium
    { name: 'Cyndaquil', stages: [155, 156, 157] }, // Cyndaquil -> Quilava -> Typhlosion
    { name: 'Totodile', stages: [158, 159, 160] },  // Totodile -> Croconaw -> Feraligatr

    // Gen 2 Popular
    { name: 'Mareep', stages: [179, 180, 181] },  // Mareep -> Flaaffy -> Ampharos
    { name: 'Larvitar', stages: [246, 247, 248] }, // Larvitar -> Pupitar -> Tyranitar

    // Gen 3 Starters
    { name: 'Treecko', stages: [252, 253, 254] },  // Treecko -> Grovyle -> Sceptile
    { name: 'Torchic', stages: [255, 256, 257] },  // Torchic -> Combusken -> Blaziken
    { name: 'Mudkip', stages: [258, 259, 260] },   // Mudkip -> Marshtomp -> Swampert

    // Gen 3 Popular
    { name: 'Ralts', stages: [280, 281, 282] },    // Ralts -> Kirlia -> Gardevoir
    { name: 'Aron', stages: [304, 305, 306] },     // Aron -> Lairon -> Aggron
    { name: 'Beldum', stages: [374, 375, 376] },   // Beldum -> Metang -> Metagross

    // Gen 4 Starters
    { name: 'Turtwig', stages: [387, 388, 389] },  // Turtwig -> Grotle -> Torterra
    { name: 'Chimchar', stages: [390, 391, 392] }, // Chimchar -> Monferno -> Infernape
    { name: 'Piplup', stages: [393, 394, 395] },   // Piplup -> Prinplup -> Empoleon

    // Gen 4 Popular
    { name: 'Gible', stages: [443, 444, 445] },    // Gible -> Gabite -> Garchomp
    { name: 'Riolu', stages: [447, 448, 745] },    // Riolu -> Lucario -> Lycanroc (mixing for variety)

    // Gen 5 Starters
    { name: 'Snivy', stages: [495, 496, 497] },    // Snivy -> Servine -> Serperior
    { name: 'Tepig', stages: [498, 499, 500] },    // Tepig -> Pignite -> Emboar
    { name: 'Oshawott', stages: [501, 502, 503] }, // Oshawott -> Dewott -> Samurott

    // Gen 5 Popular
    { name: 'Deino', stages: [633, 634, 635] },    // Deino -> Zweilous -> Hydreigon

    // Gen 6 Starters
    { name: 'Chespin', stages: [650, 651, 652] },  // Chespin -> Quilladin -> Chesnaught
    { name: 'Fennekin', stages: [653, 654, 655] }, // Fennekin -> Braixen -> Delphox
    { name: 'Froakie', stages: [656, 657, 658] },  // Froakie -> Frogadier -> Greninja

    // Gen 7 Starters
    { name: 'Rowlet', stages: [722, 723, 724] },   // Rowlet -> Dartrix -> Decidueye
    { name: 'Litten', stages: [725, 726, 727] },   // Litten -> Torracat -> Incineroar
    { name: 'Popplio', stages: [728, 729, 730] },  // Popplio -> Brionne -> Primarina
  ]

  // Helper function to check if a chain has any uncaptured Pokemon
  const getAvailableChains = (captured) => {
    return evolutionChains.filter((chain) => {
      // A chain is available if at least one Pokemon in it is NOT captured
      return chain.stages.some(pokemonId =>
        !captured.some(c => c.id === pokemonId)
      )
    })
  }

  // Initialize with a chain that has uncaptured Pokemon
  const [currentChainIndex, setCurrentChainIndex] = useState(() => {
    const availableChains = getAvailableChains(
      JSON.parse(localStorage.getItem('capturedPokemon') || '[]')
    )
    if (availableChains.length === 0) {
      // All Pokemon captured - start fresh or pick any chain
      return Math.floor(Math.random() * evolutionChains.length)
    }
    // Find the index of the first available chain in the original array
    const selectedChain = availableChains[Math.floor(Math.random() * availableChains.length)]
    return evolutionChains.findIndex(c => c.name === selectedChain.name)
  })
  const currentChain = evolutionChains[currentChainIndex]

  const getHealthColor = () => {
    const healthPercentage = (health / maxHP) * 100
    if (healthPercentage > 66) return '#4ECDC4' // Teal - healthy
    if (healthPercentage > 33) return '#FFD93D' // Yellow - warning
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

  const getDifficultyRanges = (op, diff, currentLevel) => {
    // Scale factor increases with level (1.0 at level 1, up to 2.0 at level 20)
    const scaleFactor = Math.min(1 + (currentLevel - 1) * 0.05, 2.0)

    const baseRanges = {
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

    const baseRange = baseRanges[op][diff]

    // Apply scale factor to addition and subtraction (not multiplication/division to keep visual manageable)
    if (op === '+' || op === '-') {
      return {
        n1: [baseRange.n1[0], Math.floor(baseRange.n1[1] * scaleFactor)],
        n2: [baseRange.n2[0], Math.floor(baseRange.n2[1] * scaleFactor)]
      }
    } else if (op === '×' && currentLevel > 10) {
      // For higher levels, allow slightly larger multiplication
      return {
        n1: [baseRange.n1[0], Math.min(baseRange.n1[1] + Math.floor((currentLevel - 10) / 3), 7)],
        n2: [baseRange.n2[0], Math.min(baseRange.n2[1] + Math.floor((currentLevel - 10) / 3), 7)]
      }
    } else if (op === '÷' && currentLevel > 10) {
      // For higher levels, allow slightly larger division
      return {
        n1: [baseRange.n1[0], Math.min(baseRange.n1[1] + Math.floor((currentLevel - 10) / 4), 5)],
        n2: [baseRange.n2[0], Math.min(baseRange.n2[1] + Math.floor((currentLevel - 10) / 4), 5)]
      }
    }

    return baseRange
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
    // Determine difficulty based on level - progressively harder as level increases
    let randomDifficulty
    if (level <= 3) {
      // Levels 1-3: Only easy
      randomDifficulty = 'easy'
    } else if (level <= 6) {
      // Levels 4-6: Easy and medium
      randomDifficulty = Math.random() < 0.5 ? 'easy' : 'medium'
    } else if (level <= 10) {
      // Levels 7-10: Medium and some hard
      const rand = Math.random()
      if (rand < 0.3) randomDifficulty = 'easy'
      else if (rand < 0.7) randomDifficulty = 'medium'
      else randomDifficulty = 'hard'
    } else {
      // Level 11+: All difficulties with more hard questions
      const rand = Math.random()
      if (rand < 0.2) randomDifficulty = 'easy'
      else if (rand < 0.5) randomDifficulty = 'medium'
      else randomDifficulty = 'hard'
    }
    setCurrentQuestionDifficulty(randomDifficulty)

    const availableOps = getOperationsForDifficulty(randomDifficulty)
    const newOp = availableOps[Math.floor(Math.random() * availableOps.length)]
    const range = getDifficultyRanges(newOp, randomDifficulty, level)

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
    const newHealth = Math.min(maxHP, health + 15) // Increase health by 15, max maxHP
    console.log(`HP Change: ${health} → ${newHealth} (+15)`)
    setHealth(newHealth)

    // Check if we should evolve or switch chains
    if (newHealth === maxHP) {
      // Capture the current Pokemon before evolution/switching
      const pokemonId = currentChain.stages[pokemonStage]
      const alreadyCaptured = capturedPokemon.some(p => p.id === pokemonId)

      console.log('Attempting to capture:', pokemonData.name, 'ID:', pokemonId, 'Already captured:', alreadyCaptured)

      let newCaptured = capturedPokemon
      if (!alreadyCaptured) {
        const captureEntry = {
          id: pokemonId,
          name: pokemonData.name,
          sprite: pokemonData.sprites.front_default,
          capturedAt: new Date().toISOString()
        }

        newCaptured = [...capturedPokemon, captureEntry]
        setCapturedPokemon(newCaptured)
        localStorage.setItem('capturedPokemon', JSON.stringify(newCaptured))
        console.log('✓ Captured new Pokemon:', pokemonData.name, 'Total captured:', newCaptured.length)
      } else {
        console.log('⨯ Skipped duplicate:', pokemonData.name)
      }

      // Check if we're at the max stage of current chain
      if (pokemonStage >= currentChain.stages.length - 1) {
        // Get available chains (ones with at least one uncaptured Pokemon)
        const availableChains = getAvailableChains(newCaptured)

        console.log('Chain switching - Available chains:', availableChains.map(c => c.name))
        console.log('Total captured Pokemon:', newCaptured.length)

        if (availableChains.length === 0) {
          // All Pokemon captured! Congratulations message
          console.log('🎉 ALL POKEMON CAPTURED! Game complete!')
          // Could add end game logic here or reset to allow replay
          // For now, just cycle through all chains again
          const newChainIndex = (currentChainIndex + 1) % evolutionChains.length
          setCurrentChainIndex(newChainIndex)
          setPokemonStage(0)
          setLevel(level + 1)
          setHealth(0)
          setMaxHP(50)
          setShowSwap(true)

          setTimeout(() => {
            fetchPokemon(evolutionChains[newChainIndex].stages[0])
            setTimeout(() => {
              setShowSwap(false)
            }, 3000)
          }, 500)
        } else {
          // Select from available chains only
          // Filter out current chain if possible
          let eligibleChains = availableChains.filter((chain) => {
            return evolutionChains.findIndex(c => c.name === chain.name) !== currentChainIndex
          })

          // If all available chains are the current chain, use any available
          if (eligibleChains.length === 0) {
            eligibleChains = availableChains
          }

          const selectedChain = eligibleChains[Math.floor(Math.random() * eligibleChains.length)]
          const newChainIndex = evolutionChains.findIndex(c => c.name === selectedChain.name)

          console.log('✓ Switching to chain:', selectedChain.name, 'Index:', newChainIndex)

          setCurrentChainIndex(newChainIndex)
          setPokemonStage(0)
          setLevel(level + 1) // Keep leveling up instead of resetting to 1
          setHealth(0)
          setMaxHP(50)
          setShowSwap(true) // Use swap animation instead of evolution

          setTimeout(() => {
            fetchPokemon(evolutionChains[newChainIndex].stages[0])
            setTimeout(() => {
              setShowSwap(false)
            }, 3000)
          }, 500)
        }
      } else {
        // Normal evolution within current chain
        const newStage = pokemonStage + 1
        const newLevel = level + 1
        setPokemonStage(newStage)
        setLevel(newLevel)
        setHealth(0) // Reset health to 0 after evolution

        // Exponentially increase maxHP: 50, 100, 200, 400...
        const newMaxHP = Math.floor(50 * Math.pow(2, newStage))
        setMaxHP(newMaxHP)

        setShowEvolution(true)

        setTimeout(() => {
          fetchPokemon(currentChain.stages[newStage])
          setTimeout(() => {
            setShowEvolution(false)
          }, 3000)
        }, 500)
      }
    }
  }

  const handleWrongAnswer = () => {
    const newHealth = Math.max(0, health - 20) // Decrease health by 20, min 0
    console.log(`HP Change: ${health} → ${newHealth} (-20)`)
    setHealth(newHealth)

    // Devolve when health reaches 0 and not at first stage
    if (newHealth === 0 && pokemonStage > 0) {
      const newStage = pokemonStage - 1
      const newLevel = Math.max(1, level - 1)
      setPokemonStage(newStage)
      setLevel(newLevel)

      // Exponentially decrease maxHP back to previous stage
      const newMaxHP = Math.floor(50 * Math.pow(2, newStage))
      setMaxHP(newMaxHP)

      setHealth(0) // Reset health to 0 after devolution
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
    // Prevent multiple submissions
    if (isProcessingAnswer) {
      console.log('⚠ Answer already being processed, ignoring duplicate click')
      return
    }

    let correctAnswer
    switch (operation) {
      case '+': correctAnswer = num1 + num2; break
      case '-': correctAnswer = num1 - num2; break
      case '×': correctAnswer = num1 * num2; break
      case '÷': correctAnswer = num1 / num2; break
      default: correctAnswer = 0
    }

    const userAnswer = parseInt(answer)

    console.log('Check Answer:', {
      userInput: answer,
      userAnswer,
      correctAnswer,
      isCorrect: userAnswer === correctAnswer,
      isNaN: isNaN(userAnswer)
    })

    // Check if answer is valid and correct
    if (!isNaN(userAnswer) && userAnswer === correctAnswer) {
      setIsProcessingAnswer(true)
      console.log('✓ CORRECT ANSWER - Increasing HP')
      const randomMessage = encouragementMessages[Math.floor(Math.random() * encouragementMessages.length)]
      const points = getScoreForDifficulty(currentQuestionDifficulty)
      setMessage(`${randomMessage} +${points} pts!`)
      setScore(score + points)
      handleCorrectAnswer()
      setShowCelebration(true)

      setTimeout(() => {
        setShowCelebration(false)
        generateProblem()
        setIsProcessingAnswer(false)
      }, 1500)
    } else {
      setIsProcessingAnswer(true)
      console.log('⨯ WRONG ANSWER - Decreasing HP')
      setMessage('Oops! Wrong answer!')
      handleWrongAnswer()
      setAnswer('')
      // Reset processing flag immediately for wrong answers
      setTimeout(() => {
        setIsProcessingAnswer(false)
      }, 300)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && answer !== '') {
      checkAnswer()
    }
  }

  return (
    <div className="game-container">
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
          <h1 className="game-title">Math Adventure</h1>

          <div className="game-content-inner">
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
            placeholder="Type your answer"
            autoFocus
          />
          <button
            className="submit-button"
            onClick={checkAnswer}
            disabled={answer === '' || isProcessingAnswer}
          >
            Check Answer
          </button>
        </div>

        <button className="skip-button" onClick={generateProblem} title="Skip to next question">
          <MdSkipNext />
        </button>

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
        </div>
      </div>

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
    </div>
  )
}

export default App
