import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useGameState } from './useGameState'
import { evolutionChains } from './gameLogic'

describe('useGameState Hook', () => {
  describe('Initial State', () => {
    it('should initialize with correct default values', () => {
      const { result } = renderHook(() => useGameState())

      expect(result.current.pokemonStage).toBe(0)
      expect(result.current.currentChainIndex).toBe(0)
      expect(result.current.health).toBe(0)
      expect(result.current.maxHP).toBe(50)
      expect(result.current.level).toBe(1)
      expect(result.current.capturedPokemon).toEqual([])
      expect(result.current.showEvolution).toBe(false)
      expect(result.current.showDevolution).toBe(false)
      expect(result.current.showSwap).toBe(false)
    })

    it('should initialize with custom chain index', () => {
      const { result } = renderHook(() => useGameState(2))

      expect(result.current.currentChainIndex).toBe(2)
      expect(result.current.currentChain.name).toBe('Bulbasaur')
    })

    it('should initialize with captured pokemon', () => {
      const captured = [{ id: 7, name: 'squirtle' }]
      const { result } = renderHook(() => useGameState(0, captured))

      expect(result.current.capturedPokemon).toEqual(captured)
    })

    it('should set correct current pokemon ID', () => {
      const { result } = renderHook(() => useGameState(0))

      expect(result.current.currentPokemonId).toBe(7) // Squirtle
    })
  })

  describe('Health Calculation on Correct Answer', () => {
    it('should increase health by 15 on correct answer', () => {
      const { result } = renderHook(() => useGameState())

      act(() => {
        result.current.setHealth(20)
        result.current.setMaxHP(100)
      })

      expect(result.current.health).toBe(20)

      act(() => {
        result.current.handleCorrectAnswer()
      })

      expect(result.current.health).toBe(35)
    })

    it('should cap health at maxHP and trigger evolution', () => {
      const { result } = renderHook(() => useGameState())

      act(() => {
        result.current.setHealth(40)
        result.current.setMaxHP(50)
      })

      act(() => {
        result.current.handleCorrectAnswer()
      })

      // Health reaches 55 (40+15) but caps at 50, triggering evolution
      expect(result.current.health).toBe(0) // Reset after evolution
      expect(result.current.pokemonStage).toBe(1)
      expect(result.current.showEvolution).toBe(true)
    })

    it('should not trigger evolution if health does not reach maxHP', () => {
      const { result } = renderHook(() => useGameState())

      act(() => {
        result.current.setHealth(30)
      })

      const actionResult = act(() => {
        return result.current.handleCorrectAnswer()
      })

      expect(result.current.health).toBe(45)
      expect(result.current.pokemonStage).toBe(0)
      expect(result.current.showEvolution).toBe(false)
    })
  })

  describe('Health Calculation on Wrong Answer', () => {
    it('should decrease health by 20 on wrong answer', () => {
      const { result } = renderHook(() => useGameState())

      act(() => {
        result.current.setHealth(50)
      })

      act(() => {
        result.current.handleWrongAnswer()
      })

      expect(result.current.health).toBe(30)
    })

    it('should not go below 0 health', () => {
      const { result } = renderHook(() => useGameState())

      act(() => {
        result.current.setHealth(10)
      })

      act(() => {
        result.current.handleWrongAnswer()
      })

      expect(result.current.health).toBe(0)
    })

    it('should not devolve at stage 0', () => {
      const { result } = renderHook(() => useGameState())

      act(() => {
        result.current.setHealth(0)
      })

      act(() => {
        result.current.handleWrongAnswer()
      })

      expect(result.current.pokemonStage).toBe(0)
      expect(result.current.showDevolution).toBe(false)
    })
  })

  describe('Evolution Logic', () => {
    it('should evolve when health reaches maxHP', () => {
      const { result } = renderHook(() => useGameState())

      act(() => {
        result.current.setHealth(35)
        result.current.setMaxHP(50)
      })

      let actionResult
      act(() => {
        actionResult = result.current.handleCorrectAnswer()
      })

      expect(result.current.health).toBe(0) // Reset after evolution
      expect(result.current.pokemonStage).toBe(1)
      expect(result.current.maxHP).toBe(100)
      expect(result.current.level).toBe(2)
      expect(result.current.showEvolution).toBe(true)
      expect(actionResult.action).toBe('evolve')
    })

    it('should capture pokemon when evolving', () => {
      const { result } = renderHook(() => useGameState())

      act(() => {
        result.current.setHealth(35)
      })

      act(() => {
        result.current.handleCorrectAnswer()
      })

      expect(result.current.capturedPokemon).toHaveLength(1)
      expect(result.current.capturedPokemon[0].id).toBe(7) // Squirtle
    })

    it('should not capture duplicate pokemon', () => {
      const captured = [{ id: 7, name: 'squirtle', capturedAt: '2025-01-01' }]
      const { result } = renderHook(() => useGameState(0, captured))

      act(() => {
        result.current.setHealth(35)
      })

      act(() => {
        result.current.handleCorrectAnswer()
      })

      expect(result.current.capturedPokemon).toHaveLength(1)
    })

    it('should increase maxHP exponentially through evolutions', () => {
      const { result } = renderHook(() => useGameState())

      // First evolution
      act(() => {
        result.current.setHealth(35)
      })
      act(() => {
        result.current.handleCorrectAnswer()
      })
      expect(result.current.maxHP).toBe(100)

      // Second evolution
      act(() => {
        result.current.setHealth(85)
      })
      act(() => {
        result.current.handleCorrectAnswer()
      })
      expect(result.current.maxHP).toBe(200)
    })
  })

  describe('Devolution Logic', () => {
    it('should devolve when health reaches 0 at stage > 0', () => {
      const { result } = renderHook(() => useGameState())

      // First evolve to stage 1
      act(() => {
        result.current.setPokemonStage(1)
        result.current.setMaxHP(100)
        result.current.setHealth(20)
      })

      let actionResult
      act(() => {
        actionResult = result.current.handleWrongAnswer()
      })

      expect(result.current.health).toBe(0)
      expect(result.current.pokemonStage).toBe(0)
      expect(result.current.maxHP).toBe(50)
      expect(result.current.showDevolution).toBe(true)
      expect(actionResult.action).toBe('devolve')
    })

    it('should decrease level on devolution', () => {
      const { result } = renderHook(() => useGameState())

      act(() => {
        result.current.setPokemonStage(1)
        result.current.setLevel(5)
        result.current.setHealth(10)
      })

      act(() => {
        result.current.handleWrongAnswer()
      })

      expect(result.current.level).toBe(4)
    })

    it('should not decrease level below 1', () => {
      const { result } = renderHook(() => useGameState())

      act(() => {
        result.current.setPokemonStage(1)
        result.current.setLevel(1)
        result.current.setHealth(10)
      })

      act(() => {
        result.current.handleWrongAnswer()
      })

      expect(result.current.level).toBe(1)
    })
  })

  describe('Chain Switching - Jolteon Bug Investigation', () => {
    it('should switch chains when at max stage with full HP', () => {
      const eeveeChainIndex = evolutionChains.findIndex(c => c.name === 'Eevee')
      const { result } = renderHook(() => useGameState(eeveeChainIndex))

      // Set to Jolteon (stage 2) with nearly full HP
      act(() => {
        result.current.setPokemonStage(2)
        result.current.setMaxHP(200)
        result.current.setHealth(185)
        result.current.setLevel(3)
      })

      expect(result.current.currentPokemonId).toBe(135) // Jolteon

      let actionResult
      act(() => {
        actionResult = result.current.handleCorrectAnswer()
      })

      // Should switch to a different chain
      expect(actionResult.action).toBe('swap')
      expect(result.current.pokemonStage).toBe(0)
      expect(result.current.health).toBe(0)
      expect(result.current.maxHP).toBe(50)
      expect(result.current.showSwap).toBe(true)
      expect(result.current.currentChainIndex).not.toBe(eeveeChainIndex)
    })

    it('should capture Jolteon before switching chains', () => {
      const eeveeChainIndex = evolutionChains.findIndex(c => c.name === 'Eevee')
      const { result } = renderHook(() => useGameState(eeveeChainIndex))

      act(() => {
        result.current.setPokemonStage(2)
        result.current.setMaxHP(200)
        result.current.setHealth(185)
      })

      act(() => {
        result.current.handleCorrectAnswer()
      })

      expect(result.current.capturedPokemon).toHaveLength(1)
      expect(result.current.capturedPokemon[0].id).toBe(135) // Jolteon
    })

    it('should switch to available chain with uncaptured pokemon', () => {
      const eeveeChainIndex = evolutionChains.findIndex(c => c.name === 'Eevee')

      // Capture all Squirtle chain
      const captured = [
        { id: 7, name: 'squirtle' },
        { id: 8, name: 'wartortle' },
        { id: 9, name: 'blastoise' }
      ]

      const { result } = renderHook(() => useGameState(eeveeChainIndex, captured))

      act(() => {
        result.current.setPokemonStage(2)
        result.current.setMaxHP(200)
        result.current.setHealth(185)
      })

      act(() => {
        result.current.handleCorrectAnswer()
      })

      const newChain = evolutionChains[result.current.currentChainIndex]
      expect(newChain.name).not.toBe('Squirtle') // Should not be fully captured chain
      expect(newChain.name).not.toBe('Eevee') // Should not be current chain
    })

    it('should handle all pokemon captured scenario', () => {
      const eeveeChainIndex = evolutionChains.findIndex(c => c.name === 'Eevee')

      // Capture all pokemon except Jolteon
      const allButJolteon = evolutionChains
        .flatMap(chain => chain.stages)
        .filter(id => id !== 135)
        .map(id => ({ id, name: `pokemon-${id}` }))

      const { result } = renderHook(() => useGameState(eeveeChainIndex, allButJolteon))

      act(() => {
        result.current.setPokemonStage(2)
        result.current.setMaxHP(200)
        result.current.setHealth(185)
      })

      let actionResult
      act(() => {
        actionResult = result.current.handleCorrectAnswer()
      })

      expect(actionResult.action).toBe('swap')
      expect(actionResult.allCaptured).toBe(true)
      expect(result.current.capturedPokemon).toHaveLength(allButJolteon.length + 1)
    })

    it('should increment level when switching chains', () => {
      const eeveeChainIndex = evolutionChains.findIndex(c => c.name === 'Eevee')
      const { result } = renderHook(() => useGameState(eeveeChainIndex))

      act(() => {
        result.current.setPokemonStage(2)
        result.current.setMaxHP(200)
        result.current.setHealth(185)
        result.current.setLevel(5)
      })

      act(() => {
        result.current.handleCorrectAnswer()
      })

      expect(result.current.level).toBe(6)
    })
  })

  describe('Animation State Management', () => {
    it('should set showEvolution on evolution', () => {
      const { result } = renderHook(() => useGameState())

      act(() => {
        result.current.setHealth(35)
      })

      expect(result.current.showEvolution).toBe(false)

      act(() => {
        result.current.handleCorrectAnswer()
      })

      expect(result.current.showEvolution).toBe(true)
    })

    it('should set showDevolution on devolution', () => {
      const { result } = renderHook(() => useGameState())

      act(() => {
        result.current.setPokemonStage(1)
        result.current.setHealth(10)
      })

      expect(result.current.showDevolution).toBe(false)

      act(() => {
        result.current.handleWrongAnswer()
      })

      expect(result.current.showDevolution).toBe(true)
    })

    it('should set showSwap on chain switch', () => {
      const eeveeChainIndex = evolutionChains.findIndex(c => c.name === 'Eevee')
      const { result } = renderHook(() => useGameState(eeveeChainIndex))

      act(() => {
        result.current.setPokemonStage(2)
        result.current.setMaxHP(200)
        result.current.setHealth(185)
      })

      expect(result.current.showSwap).toBe(false)

      act(() => {
        result.current.handleCorrectAnswer()
      })

      expect(result.current.showSwap).toBe(true)
    })

    it('should reset all animations', () => {
      const { result } = renderHook(() => useGameState())

      act(() => {
        result.current.setHealth(35)
      })

      act(() => {
        result.current.handleCorrectAnswer()
      })

      expect(result.current.showEvolution).toBe(true)

      act(() => {
        result.current.resetAnimations()
      })

      expect(result.current.showEvolution).toBe(false)
      expect(result.current.showDevolution).toBe(false)
      expect(result.current.showSwap).toBe(false)
    })
  })

  describe('Full Game Flow Integration', () => {
    it('should complete full evolution cycle from Squirtle to Blastoise', () => {
      const { result } = renderHook(() => useGameState(0)) // Squirtle chain

      // Squirtle -> Wartortle
      act(() => {
        result.current.setHealth(35)
      })
      act(() => {
        result.current.handleCorrectAnswer()
      })

      expect(result.current.pokemonStage).toBe(1)
      expect(result.current.currentPokemonId).toBe(8) // Wartortle

      // Wartortle -> Blastoise
      act(() => {
        result.current.setHealth(85)
      })
      act(() => {
        result.current.handleCorrectAnswer()
      })

      expect(result.current.pokemonStage).toBe(2)
      expect(result.current.currentPokemonId).toBe(9) // Blastoise

      // Blastoise -> Chain Switch
      act(() => {
        result.current.setHealth(185)
      })
      act(() => {
        result.current.handleCorrectAnswer()
      })

      expect(result.current.pokemonStage).toBe(0)
      expect(result.current.currentChainIndex).not.toBe(0)
      expect(result.current.capturedPokemon).toHaveLength(3)
    })

    it('should handle multiple wrong answers leading to devolution', () => {
      const { result } = renderHook(() => useGameState())

      // Evolve first
      act(() => {
        result.current.setPokemonStage(1)
        result.current.setMaxHP(100)
        result.current.setLevel(2)
        result.current.setHealth(50)
      })

      // Multiple wrong answers
      act(() => {
        result.current.handleWrongAnswer() // 30
      })
      expect(result.current.health).toBe(30)

      act(() => {
        result.current.handleWrongAnswer() // 10
      })
      expect(result.current.health).toBe(10)

      act(() => {
        result.current.handleWrongAnswer() // 0 -> devolve
      })
      expect(result.current.health).toBe(0)
      expect(result.current.pokemonStage).toBe(0)
      expect(result.current.showDevolution).toBe(true)
    })

    it('should maintain captured pokemon across chain switches', () => {
      const { result } = renderHook(() => useGameState(0))

      const captureIds = []

      // Evolve through Squirtle chain
      act(() => {
        result.current.setHealth(35)
      })
      act(() => {
        result.current.handleCorrectAnswer()
      })
      captureIds.push(7) // Squirtle

      act(() => {
        result.current.setHealth(85)
      })
      act(() => {
        result.current.handleCorrectAnswer()
      })
      captureIds.push(8) // Wartortle

      act(() => {
        result.current.setHealth(185)
      })
      act(() => {
        result.current.handleCorrectAnswer()
      })
      captureIds.push(9) // Blastoise

      expect(result.current.capturedPokemon).toHaveLength(3)
      expect(result.current.capturedPokemon.map(p => p.id)).toEqual(captureIds)
    })
  })
})
