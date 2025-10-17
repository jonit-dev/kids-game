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
        easy: { n1: [1, 5], n2: [1, 5] },
        medium: { n1: [2, 10], n2: [2, 10] },
        hard: { n1: [6, 12], n2: [6, 12] }
      },
      '÷': {
        easy: { n1: [2, 5], n2: [2, 5] },
        medium: { n1: [2, 10], n2: [2, 10] },
        hard: { n1: [2, 12], n2: [2, 12] }
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
    generateProblem()
  }, [])

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
      const diffLabel = currentQuestionDifficulty.charAt(0).toUpperCase() + currentQuestionDifficulty.slice(1)
      setMessage(`${randomMessage} +${points} point${points > 1 ? 's' : ''}! (${diffLabel})`)
      setScore(score + points)
      setShowCelebration(true)

      setTimeout(() => {
        setShowCelebration(false)
        generateProblem()
      }, 1500)
    } else {
      setMessage('Oops! Try again!')
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
      <div className="header">
        <h1 className="title">Math Adventure</h1>
        <div className="score-badge">Score: {score}</div>
      </div>

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
                <strong>{num1}</strong> groups of <strong>{num2}</strong> {currentEmoji} each
              </div>
              <div className="visual-group-full">
                <div className="multiplication-grid">
                  {[...Array(num1)].map((_, groupIdx) => (
                    <div key={groupIdx} className="multiplication-group" style={{ animationDelay: `${groupIdx * 0.2}s` }}>
                      {[...Array(num2)].map((_, itemIdx) => (
                        <span
                          key={itemIdx}
                          className="visual-object"
                          style={{ animationDelay: `${(groupIdx * 0.2) + (itemIdx * 0.05)}s` }}
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
                Share <strong>{num1}</strong> {currentEmoji} equally into <strong>{num2}</strong> groups
              </div>
              <div className="visual-group-full">
                <div className="division-grid">
                  {[...Array(num2)].map((_, groupIdx) => (
                    <div key={groupIdx} className="division-group" style={{ animationDelay: `${groupIdx * 0.15}s` }}>
                      <div className="group-label">Group {groupIdx + 1}</div>
                      <div className="division-items">
                        {[...Array(num1 / num2)].map((_, itemIdx) => (
                          <span
                            key={itemIdx}
                            className="visual-object"
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
