// Word lists for spelling practice - organized by difficulty
// Each word includes a hint image/emoji to help kids understand

export const wordCategories = {
  fruits: [
    { word: 'apple', hint: '🍎', category: 'Fruits' },
    { word: 'banana', hint: '🍌', category: 'Fruits' },
    { word: 'orange', hint: '🍊', category: 'Fruits' },
    { word: 'grape', hint: '🍇', category: 'Fruits' },
    { word: 'lemon', hint: '🍋', category: 'Fruits' },
    { word: 'peach', hint: '🍑', category: 'Fruits' },
    { word: 'pear', hint: '🍐', category: 'Fruits' },
    { word: 'melon', hint: '🍈', category: 'Fruits' },
    { word: 'cherry', hint: '🍒', category: 'Fruits' },
    { word: 'mango', hint: '🥭', category: 'Fruits' }
  ],

  animals: [
    { word: 'cat', hint: '🐱', category: 'Animals' },
    { word: 'dog', hint: '🐶', category: 'Animals' },
    { word: 'bird', hint: '🐦', category: 'Animals' },
    { word: 'fish', hint: '🐠', category: 'Animals' },
    { word: 'bear', hint: '🐻', category: 'Animals' },
    { word: 'lion', hint: '🦁', category: 'Animals' },
    { word: 'tiger', hint: '🐯', category: 'Animals' },
    { word: 'mouse', hint: '🐭', category: 'Animals' },
    { word: 'rabbit', hint: '🐰', category: 'Animals' },
    { word: 'monkey', hint: '🐵', category: 'Animals' },
    { word: 'elephant', hint: '🐘', category: 'Animals' },
    { word: 'penguin', hint: '🐧', category: 'Animals' }
  ],

  colors: [
    { word: 'red', hint: '🔴', category: 'Colors' },
    { word: 'blue', hint: '🔵', category: 'Colors' },
    { word: 'green', hint: '🟢', category: 'Colors' },
    { word: 'yellow', hint: '🟡', category: 'Colors' },
    { word: 'orange', hint: '🟠', category: 'Colors' },
    { word: 'purple', hint: '🟣', category: 'Colors' },
    { word: 'pink', hint: '🌸', category: 'Colors' },
    { word: 'black', hint: '⚫', category: 'Colors' },
    { word: 'white', hint: '⚪', category: 'Colors' },
    { word: 'brown', hint: '🟤', category: 'Colors' }
  ],

  nature: [
    { word: 'tree', hint: '🌳', category: 'Nature' },
    { word: 'flower', hint: '🌸', category: 'Nature' },
    { word: 'sun', hint: '☀️', category: 'Nature' },
    { word: 'moon', hint: '🌙', category: 'Nature' },
    { word: 'star', hint: '⭐', category: 'Nature' },
    { word: 'cloud', hint: '☁️', category: 'Nature' },
    { word: 'rain', hint: '🌧️', category: 'Nature' },
    { word: 'snow', hint: '❄️', category: 'Nature' },
    { word: 'leaf', hint: '🍃', category: 'Nature' },
    { word: 'grass', hint: '🌱', category: 'Nature' }
  ],

  food: [
    { word: 'bread', hint: '🍞', category: 'Food' },
    { word: 'cake', hint: '🍰', category: 'Food' },
    { word: 'cookie', hint: '🍪', category: 'Food' },
    { word: 'pizza', hint: '🍕', category: 'Food' },
    { word: 'cheese', hint: '🧀', category: 'Food' },
    { word: 'egg', hint: '🥚', category: 'Food' },
    { word: 'milk', hint: '🥛', category: 'Food' },
    { word: 'carrot', hint: '🥕', category: 'Food' },
    { word: 'corn', hint: '🌽', category: 'Food' },
    { word: 'rice', hint: '🍚', category: 'Food' }
  ],

  things: [
    { word: 'ball', hint: '⚽', category: 'Things' },
    { word: 'book', hint: '📖', category: 'Things' },
    { word: 'car', hint: '🚗', category: 'Things' },
    { word: 'bike', hint: '🚲', category: 'Things' },
    { word: 'house', hint: '🏠', category: 'Things' },
    { word: 'door', hint: '🚪', category: 'Things' },
    { word: 'chair', hint: '🪑', category: 'Things' },
    { word: 'table', hint: '🪑', category: 'Things' },
    { word: 'phone', hint: '📱', category: 'Things' },
    { word: 'watch', hint: '⌚', category: 'Things' }
  ]
}

// Difficulty levels based on word length and complexity
export const getDifficultyLevel = (word) => {
  if (word.length <= 3) return 'easy'
  if (word.length <= 5) return 'medium'
  return 'hard'
}

// Get all words as a flat array
export const getAllWords = () => {
  return Object.values(wordCategories).flat()
}

// Get words by difficulty
export const getWordsByDifficulty = (difficulty) => {
  const allWords = getAllWords()
  return allWords.filter(w => getDifficultyLevel(w.word) === difficulty)
}

// Get random word based on level progression
export const getRandomWord = (level) => {
  const allWords = getAllWords()

  // Progressive difficulty based on level
  let availableWords
  if (level <= 3) {
    // Easy words (3 letters or less)
    availableWords = allWords.filter(w => getDifficultyLevel(w.word) === 'easy')
  } else if (level <= 6) {
    // Easy and medium words
    availableWords = allWords.filter(w => {
      const diff = getDifficultyLevel(w.word)
      return diff === 'easy' || diff === 'medium'
    })
  } else {
    // All words
    availableWords = allWords
  }

  return availableWords[Math.floor(Math.random() * availableWords.length)]
}

// Get points for spelling based on difficulty
export const getSpellingPoints = (word) => {
  const difficulty = getDifficultyLevel(word)
  return { easy: 2, medium: 3, hard: 5 }[difficulty]
}
