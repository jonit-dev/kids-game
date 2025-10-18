// Extract core game logic for testing

// Pokemon evolution chains - using PokeAPI IDs
export const evolutionChains = [
  { name: 'Squirtle', stages: [7, 8, 9] },      // Squirtle -> Wartortle -> Blastoise
  { name: 'Charmander', stages: [4, 5, 6] },    // Charmander -> Charmeleon -> Charizard
  { name: 'Bulbasaur', stages: [1, 2, 3] },     // Bulbasaur -> Ivysaur -> Venusaur
  { name: 'Pikachu', stages: [172, 25, 26] },   // Pichu -> Pikachu -> Raichu
  { name: 'Eevee', stages: [133, 134, 135] }    // Eevee -> Vaporeon -> Jolteon
]

// Helper function to check if a chain has any uncaptured Pokemon
export const getAvailableChains = (captured) => {
  return evolutionChains.filter((chain) => {
    // A chain is available if at least one Pokemon in it is NOT captured
    return chain.stages.some(pokemonId =>
      !captured.some(c => c.id === pokemonId)
    )
  })
}

export const getDifficultyRanges = (op, diff, currentLevel) => {
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

export const getScoreForDifficulty = (diff) => {
  return { easy: 1, medium: 2, hard: 3 }[diff]
}

export const getOperationsForDifficulty = (diff) => {
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

export const calculateCorrectAnswer = (num1, num2, operation) => {
  switch (operation) {
    case '+': return num1 + num2
    case '-': return num1 - num2
    case '×': return num1 * num2
    case '÷': return num1 / num2
    default: return 0
  }
}

export const calculateNewHealth = (currentHealth, isCorrect, maxHP) => {
  if (isCorrect) {
    return Math.min(maxHP, currentHealth + 15) // Increase health by 15, max maxHP
  } else {
    return Math.max(0, currentHealth - 20) // Decrease health by 20, min 0
  }
}

export const calculateMaxHP = (pokemonStage) => {
  return Math.floor(50 * Math.pow(2, pokemonStage))
}

export const shouldEvolve = (health, maxHP) => {
  return health === maxHP
}

export const shouldDevolve = (health, pokemonStage) => {
  return health === 0 && pokemonStage > 0
}

export const isAtMaxStage = (pokemonStage, chain) => {
  return pokemonStage >= chain.stages.length - 1
}

export const isPokemonCaptured = (pokemonId, capturedPokemon) => {
  return capturedPokemon.some(p => p.id === pokemonId)
}
