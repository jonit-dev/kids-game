import { useState, useEffect } from 'react'
import { MdSkipNext, MdVolumeUp } from 'react-icons/md'
import { useGame } from '../context/GameContext'
import { getRandomWord, getSpellingPoints } from '../wordData'
import { useSpeech } from '../useSpeech'
import GameLayout from './GameLayout'

function SpellingGame() {
  const { score, setScore, handleCorrectAnswer, handleWrongAnswer } = useGame()
  const { speakWord, spellOut, isSupported: isSpeechSupported, voicesReady, isBlocked } = useSpeech()

  const [currentWord, setCurrentWord] = useState(null)
  const [showSpellingHint, setShowSpellingHint] = useState(false)
  const [answer, setAnswer] = useState('')
  const [message, setMessage] = useState("Let's learn!")
  const [showCelebration, setShowCelebration] = useState(false)
  const [isProcessingAnswer, setIsProcessingAnswer] = useState(false)
  const [level, setLevel] = useState(1)

  const encouragementMessages = [
    'Great job!',
    'You\'re awesome!',
    'Fantastic!',
    'Amazing work!',
    'Perfect!',
    'Brilliant!',
    'Super smart!'
  ]

  const generateSpellingWord = () => {
    const word = getRandomWord(level)
    setCurrentWord(word)
    setAnswer('')
    setShowSpellingHint(false)
    setMessage('Listen and spell the word!')

    setTimeout(() => {
      speakWord(word.word)
    }, 500)
  }

  useEffect(() => {
    generateSpellingWord()
  }, [])

  const checkAnswer = () => {
    if (isProcessingAnswer) {
      console.log('⚠ Answer already being processed, ignoring duplicate click')
      return
    }

    const correctAnswer = currentWord.word.toLowerCase()
    const userAnswer = answer.toLowerCase().trim()

    const isCorrect = userAnswer === correctAnswer
    const points = isCorrect ? getSpellingPoints(currentWord.word) : 0

    if (isCorrect) {
      setIsProcessingAnswer(true)
      const randomMessage = encouragementMessages[Math.floor(Math.random() * encouragementMessages.length)]
      setMessage(`${randomMessage} +${points} pts!`)
      setScore(score + points)
      handleCorrectAnswer()
      setShowCelebration(true)

      setTimeout(() => {
        setShowCelebration(false)
        generateSpellingWord()
        setIsProcessingAnswer(false)
      }, 1500)
    } else {
      setIsProcessingAnswer(true)
      setMessage(`Oops! It's spelled: ${correctAnswer}`)
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

  if (!currentWord) {
    return <GameLayout gameTitle="Spelling Adventure">Loading...</GameLayout>
  }

  return (
    <GameLayout gameTitle="Spelling Adventure">
      <div className="game-content-inner">
        <div className={`message ${showCelebration ? 'celebration' : ''}`}>
          {message}
        </div>

        <div className="problem-container">
          <div className="spelling-problem">
            <div className="spelling-hint">
              <div className="hint-emoji">{currentWord.hint}</div>
              <div className="hint-text">{currentWord.category}</div>
            </div>

            <div className="spelling-instruction">
              Listen carefully and type the word
            </div>

            {showSpellingHint && (
              <div className="spelling-hint-display">
                First letter: <span className="hint-letter">{currentWord.word[0].toUpperCase()}</span>
                <div className="hint-sublabel">Word length: {currentWord.word.length} letters</div>
              </div>
            )}

            <div className="spelling-buttons">
              <button
                className="speak-button primary"
                onClick={() => speakWord(currentWord.word)}
                disabled={isProcessingAnswer || !isSpeechSupported}
                title={isSpeechSupported ? "Hear the word" : "Audio not supported in this browser"}
              >
                <MdVolumeUp /> Play Word
              </button>
              <button
                className="speak-button"
                onClick={() => spellOut(currentWord.word)}
                disabled={isProcessingAnswer || !isSpeechSupported}
                title={isSpeechSupported ? "Spell it out letter by letter" : "Audio not supported in this browser"}
              >
                <MdVolumeUp /> Spell It Out
              </button>
              <button
                className="speak-button hint-btn"
                onClick={() => setShowSpellingHint(true)}
                disabled={isProcessingAnswer || showSpellingHint}
                title="Show hint"
              >
                💡 Hint
              </button>
            </div>

            {!isSpeechSupported && (
              <div className="speech-warning">
                🔇 Audio not supported - please use a modern browser
              </div>
            )}

            {isSpeechSupported && isBlocked && (
              <div className="speech-warning blocked">
                🛡️ <strong>Audio is blocked!</strong>
                <div className="warning-details">
                  Using Brave browser? Click the Shield icon (🛡️) in the address bar,
                  then set <strong>Fingerprinting protection</strong> to "Standard" or "Off" for this site.
                </div>
                <div className="warning-note">
                  You can still play! Just type what you see in the hint.
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="answer-section">
          <input
            type="text"
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

        <button className="skip-button" onClick={generateSpellingWord} title="Skip to next question">
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

export default SpellingGame
