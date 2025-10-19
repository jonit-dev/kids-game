import { useState, useEffect } from 'react'
import { MdSkipNext } from 'react-icons/md'
import { useGame } from '../context/GameContext'
import GameLayout from './GameLayout'

function MathGame() {
  const { score, setScore, handleCorrectAnswer, handleWrongAnswer } = useGame()

  const [num1, setNum1] = useState(0)
  const [num2, setNum2] = useState(0)
  const [operation, setOperation] = useState('+')
  const [answer, setAnswer] = useState('')
  const [message, setMessage] = useState("Let's learn!")
  const [showCelebration, setShowCelebration] = useState(false)
  const [currentEmoji, setCurrentEmoji] = useState('🍎')
  const [currentQuestionDifficulty, setCurrentQuestionDifficulty] = useState('easy')
  const [isProcessingAnswer, setIsProcessingAnswer] = useState(false)
  const [level, setLevel] = useState(1)

  const visualObjects = [
    '🍎', '🍌', '🍊', '🍇', '🍓',
    '⚽', '🎈', '⭐', '🌸', '🦋',
    '🐠', '🐢', '🐶', '🐱', '🐰'
  ]

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
        easy: { n1: [2, 3], n2: [2, 3] },
        medium: { n1: [2, 4], n2: [2, 4] },
        hard: { n1: [2, 5], n2: [2, 5] }
      },
      '÷': {
        easy: { n1: [2, 2], n2: [2, 2] },
        medium: { n1: [2, 3], n2: [2, 3] },
        hard: { n1: [2, 4], n2: [2, 4] }
      }
    }

    const baseRange = baseRanges[op][diff]

    if (op === '+' || op === '-') {
      return {
        n1: [baseRange.n1[0], Math.floor(baseRange.n1[1] * scaleFactor)],
        n2: [baseRange.n2[0], Math.floor(baseRange.n2[1] * scaleFactor)]
      }
    } else if (op === '×' && currentLevel > 10) {
      return {
        n1: [baseRange.n1[0], Math.min(baseRange.n1[1] + Math.floor((currentLevel - 10) / 3), 7)],
        n2: [baseRange.n2[0], Math.min(baseRange.n2[1] + Math.floor((currentLevel - 10) / 3), 7)]
      }
    } else if (op === '÷' && currentLevel > 10) {
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
    const ops = {
      easy: ['+', '-'],
      medium: ['+', '-', '×'],
      hard: ['+', '-', '×', '÷']
    }
    return ops[diff]
  }

  const generateProblem = () => {
    let randomDifficulty
    if (level <= 3) {
      randomDifficulty = 'easy'
    } else if (level <= 6) {
      randomDifficulty = Math.random() < 0.5 ? 'easy' : 'medium'
    } else if (level <= 10) {
      const rand = Math.random()
      if (rand < 0.3) randomDifficulty = 'easy'
      else if (rand < 0.7) randomDifficulty = 'medium'
      else randomDifficulty = 'hard'
    } else {
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
      n2 = Math.floor(Math.random() * (range.n2[1] - range.n2[0] + 1)) + range.n2[0]
      const multiplier = Math.floor(Math.random() * (range.n1[1] - range.n1[0] + 1)) + range.n1[0]
      n1 = n2 * multiplier
    } else if (newOp === '-') {
      n1 = Math.floor(Math.random() * (range.n1[1] - range.n1[0] + 1)) + range.n1[0]
      n2 = Math.floor(Math.random() * Math.min(n1, range.n2[1])) + range.n2[0]
      n2 = Math.min(n2, n1)
    } else {
      n1 = Math.floor(Math.random() * (range.n1[1] - range.n1[0] + 1)) + range.n1[0]
      n2 = Math.floor(Math.random() * (range.n2[1] - range.n2[0] + 1)) + range.n2[0]
    }

    const randomEmoji = visualObjects[Math.floor(Math.random() * visualObjects.length)]
    setCurrentEmoji(randomEmoji)

    setNum1(n1)
    setNum2(n2)
    setOperation(newOp)
    setAnswer('')
    setMessage('Try this one!')
  }

  useEffect(() => {
    generateProblem()
  }, [])

  const checkAnswer = () => {
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
    const isCorrect = !isNaN(userAnswer) && userAnswer === correctAnswer
    const points = isCorrect ? getScoreForDifficulty(currentQuestionDifficulty) : 0

    if (isCorrect) {
      setIsProcessingAnswer(true)
      const randomMessage = encouragementMessages[Math.floor(Math.random() * encouragementMessages.length)]
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
      setMessage('Oops! Wrong answer!')
      handleWrongAnswer()
      setAnswer('')
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
    <GameLayout gameTitle="Math Adventure">
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
    </GameLayout>
  )
}

export default MathGame
