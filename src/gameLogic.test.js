import { describe, it, expect } from 'vitest'
import {
  evolutionChains,
  getAvailableChains,
  getDifficultyRanges,
  getScoreForDifficulty,
  getOperationsForDifficulty,
  calculateCorrectAnswer,
  calculateNewHealth,
  calculateMaxHP,
  shouldEvolve,
  shouldDevolve,
  isAtMaxStage,
  isPokemonCaptured
} from './gameLogic'

describe('Evolution Chains', () => {
  it('should have 5 evolution chains', () => {
    expect(evolutionChains).toHaveLength(5)
  })

  it('should have valid chain structures', () => {
    evolutionChains.forEach(chain => {
      expect(chain).toHaveProperty('name')
      expect(chain).toHaveProperty('stages')
      expect(chain.stages).toBeInstanceOf(Array)
      expect(chain.stages.length).toBeGreaterThan(0)
    })
  })

  it('should have 3 stages per chain', () => {
    evolutionChains.forEach(chain => {
      expect(chain.stages).toHaveLength(3)
    })
  })
})

describe('getAvailableChains', () => {
  it('should return all chains when no pokemon are captured', () => {
    const available = getAvailableChains([])
    expect(available).toHaveLength(5)
  })

  it('should exclude chains where all pokemon are captured', () => {
    const captured = [
      { id: 7, name: 'squirtle' },
      { id: 8, name: 'wartortle' },
      { id: 9, name: 'blastoise' }
    ]
    const available = getAvailableChains(captured)
    expect(available).toHaveLength(4)
    expect(available.some(chain => chain.name === 'Squirtle')).toBe(false)
  })

  it('should include chains with at least one uncaptured pokemon', () => {
    const captured = [
      { id: 7, name: 'squirtle' },
      { id: 8, name: 'wartortle' }
      // Blastoise (9) not captured
    ]
    const available = getAvailableChains(captured)
    expect(available).toHaveLength(5)
    expect(available.some(chain => chain.name === 'Squirtle')).toBe(true)
  })

  it('should return empty array when all pokemon are captured', () => {
    const allPokemon = evolutionChains.flatMap(chain =>
      chain.stages.map(id => ({ id, name: `pokemon-${id}` }))
    )
    const available = getAvailableChains(allPokemon)
    expect(available).toHaveLength(0)
  })
})

describe('getDifficultyRanges', () => {
  describe('Addition', () => {
    it('should return correct easy ranges at level 1', () => {
      const ranges = getDifficultyRanges('+', 'easy', 1)
      expect(ranges.n1).toEqual([1, 5])
      expect(ranges.n2).toEqual([1, 5])
    })

    it('should scale with level', () => {
      const level1 = getDifficultyRanges('+', 'easy', 1)
      const level10 = getDifficultyRanges('+', 'easy', 10)
      expect(level10.n1[1]).toBeGreaterThan(level1.n1[1])
    })

    it('should cap scale factor at 2.0', () => {
      const level50 = getDifficultyRanges('+', 'easy', 50)
      expect(level50.n1[1]).toBe(10) // 5 * 2.0 = 10
    })
  })

  describe('Subtraction', () => {
    it('should return correct ranges for easy', () => {
      const ranges = getDifficultyRanges('-', 'easy', 1)
      expect(ranges.n1).toEqual([3, 7])
      expect(ranges.n2).toEqual([1, 3])
    })
  })

  describe('Multiplication', () => {
    it('should not scale at low levels', () => {
      const level1 = getDifficultyRanges('×', 'easy', 1)
      const level5 = getDifficultyRanges('×', 'easy', 5)
      expect(level1).toEqual(level5)
    })

    it('should scale after level 10', () => {
      const level10 = getDifficultyRanges('×', 'easy', 10)
      const level15 = getDifficultyRanges('×', 'easy', 15)
      expect(level15.n1[1]).toBeGreaterThan(level10.n1[1])
    })

    it('should cap multiplication range at 7', () => {
      const level100 = getDifficultyRanges('×', 'easy', 100)
      expect(level100.n1[1]).toBeLessThanOrEqual(7)
      expect(level100.n2[1]).toBeLessThanOrEqual(7)
    })
  })

  describe('Division', () => {
    it('should return correct ranges for easy', () => {
      const ranges = getDifficultyRanges('÷', 'easy', 1)
      expect(ranges.n1).toEqual([2, 2])
      expect(ranges.n2).toEqual([2, 2])
    })

    it('should cap division range at 5', () => {
      const level100 = getDifficultyRanges('÷', 'hard', 100)
      expect(level100.n1[1]).toBeLessThanOrEqual(5)
      expect(level100.n2[1]).toBeLessThanOrEqual(5)
    })
  })
})

describe('getScoreForDifficulty', () => {
  it('should return 1 for easy', () => {
    expect(getScoreForDifficulty('easy')).toBe(1)
  })

  it('should return 2 for medium', () => {
    expect(getScoreForDifficulty('medium')).toBe(2)
  })

  it('should return 3 for hard', () => {
    expect(getScoreForDifficulty('hard')).toBe(3)
  })
})

describe('getOperationsForDifficulty', () => {
  it('should return only + and - for easy', () => {
    const ops = getOperationsForDifficulty('easy')
    expect(ops).toEqual(['+', '-'])
  })

  it('should include multiplication for medium', () => {
    const ops = getOperationsForDifficulty('medium')
    expect(ops).toEqual(['+', '-', '×'])
  })

  it('should include all operations for hard', () => {
    const ops = getOperationsForDifficulty('hard')
    expect(ops).toEqual(['+', '-', '×', '÷'])
  })
})

describe('calculateCorrectAnswer', () => {
  it('should correctly add', () => {
    expect(calculateCorrectAnswer(5, 3, '+')).toBe(8)
  })

  it('should correctly subtract', () => {
    expect(calculateCorrectAnswer(10, 3, '-')).toBe(7)
  })

  it('should correctly multiply', () => {
    expect(calculateCorrectAnswer(4, 5, '×')).toBe(20)
  })

  it('should correctly divide', () => {
    expect(calculateCorrectAnswer(10, 2, '÷')).toBe(5)
  })

  it('should handle division with decimals', () => {
    expect(calculateCorrectAnswer(7, 2, '÷')).toBe(3.5)
  })

  it('should return 0 for invalid operation', () => {
    expect(calculateCorrectAnswer(5, 3, '%')).toBe(0)
  })
})

describe('calculateNewHealth', () => {
  it('should increase health by 15 on correct answer', () => {
    expect(calculateNewHealth(50, true, 100)).toBe(65)
  })

  it('should cap health at maxHP on correct answer', () => {
    expect(calculateNewHealth(95, true, 100)).toBe(100)
  })

  it('should decrease health by 20 on wrong answer', () => {
    expect(calculateNewHealth(50, false, 100)).toBe(30)
  })

  it('should not go below 0 on wrong answer', () => {
    expect(calculateNewHealth(10, false, 100)).toBe(0)
  })

  it('should handle exact maxHP boundary', () => {
    expect(calculateNewHealth(100, true, 100)).toBe(100)
  })

  it('should handle exact 0 boundary', () => {
    expect(calculateNewHealth(0, false, 100)).toBe(0)
  })
})

describe('calculateMaxHP', () => {
  it('should return 50 for stage 0', () => {
    expect(calculateMaxHP(0)).toBe(50)
  })

  it('should return 100 for stage 1', () => {
    expect(calculateMaxHP(1)).toBe(100)
  })

  it('should return 200 for stage 2', () => {
    expect(calculateMaxHP(2)).toBe(200)
  })

  it('should double exponentially', () => {
    expect(calculateMaxHP(3)).toBe(400)
    expect(calculateMaxHP(4)).toBe(800)
  })
})

describe('shouldEvolve', () => {
  it('should return true when health equals maxHP', () => {
    expect(shouldEvolve(100, 100)).toBe(true)
  })

  it('should return false when health is less than maxHP', () => {
    expect(shouldEvolve(99, 100)).toBe(false)
  })

  it('should return false when health is 0', () => {
    expect(shouldEvolve(0, 100)).toBe(false)
  })
})

describe('shouldDevolve', () => {
  it('should return true when health is 0 and stage > 0', () => {
    expect(shouldDevolve(0, 1)).toBe(true)
  })

  it('should return false when health is not 0', () => {
    expect(shouldDevolve(10, 1)).toBe(false)
  })

  it('should return false when stage is 0', () => {
    expect(shouldDevolve(0, 0)).toBe(false)
  })
})

describe('isAtMaxStage', () => {
  it('should return true when at last stage', () => {
    const chain = evolutionChains[0] // Squirtle chain with 3 stages
    expect(isAtMaxStage(2, chain)).toBe(true)
  })

  it('should return false when not at last stage', () => {
    const chain = evolutionChains[0]
    expect(isAtMaxStage(0, chain)).toBe(false)
    expect(isAtMaxStage(1, chain)).toBe(false)
  })

  it('should handle edge case of stage beyond max', () => {
    const chain = evolutionChains[0]
    expect(isAtMaxStage(3, chain)).toBe(true)
  })
})

describe('isPokemonCaptured', () => {
  it('should return true if pokemon is in captured list', () => {
    const captured = [{ id: 7, name: 'squirtle' }, { id: 25, name: 'pikachu' }]
    expect(isPokemonCaptured(7, captured)).toBe(true)
  })

  it('should return false if pokemon is not in captured list', () => {
    const captured = [{ id: 7, name: 'squirtle' }]
    expect(isPokemonCaptured(25, captured)).toBe(false)
  })

  it('should return false for empty captured list', () => {
    expect(isPokemonCaptured(7, [])).toBe(false)
  })
})

describe('Game Flow Integration Tests', () => {
  it('should handle full evolution cycle', () => {
    let health = 0
    let stage = 0
    const maxHP = calculateMaxHP(stage)

    // Answer correctly multiple times to fill health bar
    for (let i = 0; i < 7; i++) {
      health = calculateNewHealth(health, true, maxHP)
    }

    expect(health).toBeGreaterThanOrEqual(maxHP)
    expect(shouldEvolve(maxHP, maxHP)).toBe(true)
  })

  it('should handle devolution scenario', () => {
    let health = 50
    let stage = 1
    const maxHP = calculateMaxHP(stage)

    // Wrong answers to reach 0 health
    health = calculateNewHealth(health, false, maxHP) // 30
    health = calculateNewHealth(health, false, maxHP) // 10
    health = calculateNewHealth(health, false, maxHP) // 0

    expect(health).toBe(0)
    expect(shouldDevolve(health, stage)).toBe(true)
  })

  it('should track pokemon capture correctly', () => {
    const captured = []
    const pokemonId = 7

    expect(isPokemonCaptured(pokemonId, captured)).toBe(false)

    const newCaptured = [...captured, { id: pokemonId, name: 'squirtle' }]
    expect(isPokemonCaptured(pokemonId, newCaptured)).toBe(true)
  })

  it('should correctly identify when to switch chains', () => {
    const chain = evolutionChains[0]
    const stage = 2 // Last stage

    expect(isAtMaxStage(stage, chain)).toBe(true)

    // Simulate all pokemon in chain being captured
    const captured = chain.stages.map(id => ({ id, name: `pokemon-${id}` }))
    const available = getAvailableChains(captured)

    expect(available).not.toContain(chain)
  })

  it('should properly calculate score progression', () => {
    let score = 0

    // Easy question
    score += getScoreForDifficulty('easy')
    expect(score).toBe(1)

    // Medium question
    score += getScoreForDifficulty('medium')
    expect(score).toBe(3)

    // Hard question
    score += getScoreForDifficulty('hard')
    expect(score).toBe(6)
  })
})
