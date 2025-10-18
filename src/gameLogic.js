// Extract core game logic for testing

// Pokemon evolution chains - using PokeAPI IDs
export const evolutionChains = [
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
