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

  const generateProblem = () => {
    const operations = ['+', '-']
    const newOp = operations[Math.floor(Math.random() * operations.length)]

    let n1, n2
    if (newOp === '+') {
      n1 = Math.floor(Math.random() * 10) + 1
      n2 = Math.floor(Math.random() * 10) + 1
    } else {
      n1 = Math.floor(Math.random() * 10) + 5
      n2 = Math.floor(Math.random() * n1) + 1
    }

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
    const correctAnswer = operation === '+' ? num1 + num2 : num1 - num2
    const userAnswer = parseInt(answer)

    if (userAnswer === correctAnswer) {
      const randomMessage = encouragementMessages[Math.floor(Math.random() * encouragementMessages.length)]
      setMessage(randomMessage)
      setScore(score + 1)
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
          <div className="problem">
            <span className="number">{num1}</span>
            <span className="operator">{operation}</span>
            <span className="number">{num2}</span>
            <span className="equals">=</span>
            <span className="question">?</span>
          </div>
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
