import { useState, useEffect } from 'react'
import { useGame } from '../context/GameContext'
import GameLayout from './GameLayout'

function MemoryGame() {
  const { score, setScore, handleCorrectAnswer, handleWrongAnswer } = useGame()

  const [memoryCards, setMemoryCards] = useState([])
  const [flippedCards, setFlippedCards] = useState([])
  const [matchedCards, setMatchedCards] = useState([])
  const [wrongMatchCards, setWrongMatchCards] = useState([])
  const [memoryMoves, setMemoryMoves] = useState(0)
  const [memoryDifficulty, setMemoryDifficulty] = useState('easy')
  const [memoryTimer, setMemoryTimer] = useState(0)
  const [memoryTimerActive, setMemoryTimerActive] = useState(false)
  const [bestTimes, setBestTimes] = useState(() => {
    const saved = localStorage.getItem('memoryBestTimes')
    return saved ? JSON.parse(saved) : { easy: null, medium: null, hard: null }
  })
  const [message, setMessage] = useState("Let's learn!")
  const [showCelebration, setShowCelebration] = useState(false)
  const [isProcessingAnswer, setIsProcessingAnswer] = useState(false)

  const visualObjects = [
    '🍎', '🍌', '🍊', '🍇', '🍓',
    '⚽', '🎈', '⭐', '🌸', '🦋',
    '🐠', '🐢', '🐶', '🐱', '🐰'
  ]

  const generateMemoryGame = (difficulty = memoryDifficulty) => {
    const pairCounts = {
      easy: 6,
      medium: 10,
      hard: 15
    }
    const pairCount = pairCounts[difficulty]
    const emojis = visualObjects.slice(0, pairCount)

    const pairs = [...emojis, ...emojis].map((emoji, index) => ({
      id: index,
      emoji,
      flipped: false,
      matched: false
    }))

    const shuffled = [...pairs]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }

    setMemoryCards(shuffled)
    setFlippedCards([])
    setMatchedCards([])
    setMemoryMoves(0)
    setMemoryTimer(0)
    setMemoryTimerActive(true)
    setMessage('Find all the matching pairs!')
  }

  useEffect(() => {
    generateMemoryGame()
  }, [])

  useEffect(() => {
    let interval
    if (memoryTimerActive) {
      interval = setInterval(() => {
        setMemoryTimer(prev => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [memoryTimerActive])

  const handleCardClick = (cardIndex) => {
    if (
      isProcessingAnswer ||
      flippedCards.length >= 2 ||
      flippedCards.includes(cardIndex) ||
      matchedCards.includes(cardIndex)
    ) {
      return
    }

    const newFlippedCards = [...flippedCards, cardIndex]
    setFlippedCards(newFlippedCards)

    if (newFlippedCards.length === 2) {
      setIsProcessingAnswer(true)
      setMemoryMoves(memoryMoves + 1)

      const [firstIndex, secondIndex] = newFlippedCards
      const firstCard = memoryCards[firstIndex]
      const secondCard = memoryCards[secondIndex]

      if (firstCard.emoji === secondCard.emoji) {
        setTimeout(() => {
          const newMatchedCards = [...matchedCards, firstIndex, secondIndex]
          setMatchedCards(newMatchedCards)
          setFlippedCards([])
          setIsProcessingAnswer(false)

          const points = 3
          setScore(score + points)
          setMessage(`Great match! +${points} pts!`)
          handleCorrectAnswer()
          setShowCelebration(true)

          setTimeout(() => {
            setShowCelebration(false)
            if (newMatchedCards.length === memoryCards.length) {
              setMemoryTimerActive(false)

              const currentTime = memoryTimer
              const currentBestTime = bestTimes[memoryDifficulty]

              if (!currentBestTime || currentTime < currentBestTime) {
                const newBestTimes = { ...bestTimes, [memoryDifficulty]: currentTime }
                setBestTimes(newBestTimes)
                localStorage.setItem('memoryBestTimes', JSON.stringify(newBestTimes))
                setMessage(`🎉 New best time! ${currentTime}s! Starting new game...`)
              } else {
                setMessage(`All pairs found in ${currentTime}s! Starting new game...`)
              }

              setTimeout(() => {
                generateMemoryGame()
              }, 2000)
            } else {
              setMessage('Find the next pair!')
            }
          }, 1000)
        }, 500)
      } else {
        setWrongMatchCards(newFlippedCards)
        setTimeout(() => {
          setFlippedCards([])
          setWrongMatchCards([])
          setIsProcessingAnswer(false)
          setMessage('Try again!')
          handleWrongAnswer()
        }, 1000)
      }
    }
  }

  return (
    <GameLayout gameTitle="Memory Game">
      <div className="game-content-inner">
        <div className={`message ${showCelebration ? 'celebration' : ''}`}>
          {message}
        </div>

        <div className="problem-container">
          <div className="memory-game">
            <div className="memory-controls">
              <div className="difficulty-selector">
                <button
                  className={`difficulty-btn ${memoryDifficulty === 'easy' ? 'active' : ''}`}
                  onClick={() => {
                    setMemoryDifficulty('easy')
                    generateMemoryGame('easy')
                  }}
                  disabled={isProcessingAnswer}
                >
                  Easy (6 pairs)
                </button>
                <button
                  className={`difficulty-btn ${memoryDifficulty === 'medium' ? 'active' : ''}`}
                  onClick={() => {
                    setMemoryDifficulty('medium')
                    generateMemoryGame('medium')
                  }}
                  disabled={isProcessingAnswer}
                >
                  Medium (10 pairs)
                </button>
                <button
                  className={`difficulty-btn ${memoryDifficulty === 'hard' ? 'active' : ''}`}
                  onClick={() => {
                    setMemoryDifficulty('hard')
                    generateMemoryGame('hard')
                  }}
                  disabled={isProcessingAnswer}
                >
                  Hard (15 pairs)
                </button>
              </div>
            </div>

            <div className="memory-stats">
              <div className="memory-stat">
                ⏱️ Time: {Math.floor(memoryTimer / 60)}:{(memoryTimer % 60).toString().padStart(2, '0')}
              </div>
              <div className="memory-stat">🎯 Moves: {memoryMoves}</div>
              <div className="memory-stat">
                ✨ Pairs: {matchedCards.length / 2} / {memoryCards.length / 2}
              </div>
              {bestTimes[memoryDifficulty] && (
                <div className="memory-stat best-time">
                  🏆 Best: {Math.floor(bestTimes[memoryDifficulty] / 60)}:{(bestTimes[memoryDifficulty] % 60).toString().padStart(2, '0')}
                </div>
              )}
            </div>

            <div className={`memory-grid difficulty-${memoryDifficulty}`}>
              {memoryCards.map((card, index) => (
                <div
                  key={index}
                  className={`memory-card ${
                    flippedCards.includes(index) || matchedCards.includes(index) ? 'flipped' : ''
                  } ${matchedCards.includes(index) ? 'matched' : ''} ${
                    wrongMatchCards.includes(index) ? 'wrong-match' : ''
                  }`}
                  style={{ '--index': index }}
                  onClick={() => handleCardClick(index)}
                >
                  <div className="memory-card-inner">
                    <div className="memory-card-front">?</div>
                    <div className="memory-card-back">{card.emoji}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
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
    </GameLayout>
  )
}

export default MemoryGame
