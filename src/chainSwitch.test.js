import { describe, it, expect } from 'vitest'
import {
  evolutionChains,
  getAvailableChains,
  isAtMaxStage,
  calculateNewHealth,
  shouldEvolve
} from './gameLogic'

describe('Chain Switching Logic - Bug Investigation', () => {
  it('should identify Jolteon (135) as final stage in Eevee chain', () => {
    const eeveeChain = evolutionChains.find(c => c.name === 'Eevee')
    expect(eeveeChain.stages).toEqual([133, 134, 135])
    expect(isAtMaxStage(2, eeveeChain)).toBe(true)
  })

  it('should require chain switch when at max stage with full HP', () => {
    const eeveeChain = evolutionChains.find(c => c.name === 'Eevee')
    const pokemonStage = 2 // Jolteon
    const maxHP = 200
    const health = 200

    const atMaxStage = isAtMaxStage(pokemonStage, eeveeChain)
    const shouldEvolveNow = shouldEvolve(health, maxHP)

    expect(atMaxStage).toBe(true)
    expect(shouldEvolveNow).toBe(true)
  })

  it('should have available chains when only Eevee chain is complete', () => {
    const eeveeChain = evolutionChains.find(c => c.name === 'Eevee')
    const capturedEeveeChain = eeveeChain.stages.map(id => ({
      id,
      name: `pokemon-${id}`
    }))

    const available = getAvailableChains(capturedEeveeChain)
    expect(available.length).toBe(4) // All chains except Eevee
    expect(available.some(c => c.name === 'Eevee')).toBe(false)
  })

  it('should correctly handle Jolteon reaching 200/200 HP', () => {
    // Simulate the exact scenario from the bug report
    const eeveeChain = evolutionChains.find(c => c.name === 'Eevee')
    const pokemonStage = 2 // Jolteon
    const currentHealth = 185
    const maxHP = 200

    // User answers correctly
    const newHealth = calculateNewHealth(currentHealth, true, maxHP)

    console.log('Jolteon Test:', {
      oldHealth: currentHealth,
      newHealth,
      maxHP,
      shouldEvolve: shouldEvolve(newHealth, maxHP),
      isAtMaxStage: isAtMaxStage(pokemonStage, eeveeChain)
    })

    expect(newHealth).toBe(200)
    expect(shouldEvolve(newHealth, maxHP)).toBe(true)
    expect(isAtMaxStage(pokemonStage, eeveeChain)).toBe(true)

    // These conditions should trigger chain switch logic
    const needsChainSwitch = shouldEvolve(newHealth, maxHP) && isAtMaxStage(pokemonStage, eeveeChain)
    expect(needsChainSwitch).toBe(true)
  })

  it('should provide valid alternative chain when all chains available', () => {
    const eeveeChain = evolutionChains.find(c => c.name === 'Eevee')
    const currentChainIndex = evolutionChains.findIndex(c => c.name === 'Eevee')

    // No pokemon captured yet
    const available = getAvailableChains([])

    // Should be able to filter out current chain
    const eligibleChains = available.filter((chain) => {
      return evolutionChains.findIndex(c => c.name === chain.name) !== currentChainIndex
    })

    expect(eligibleChains.length).toBe(4)
    expect(eligibleChains.some(c => c.name === 'Eevee')).toBe(false)
  })

  it('should handle case where only one chain remains uncaptured', () => {
    // Capture all but Pikachu chain
    const allButPikachu = evolutionChains
      .filter(c => c.name !== 'Pikachu')
      .flatMap(chain => chain.stages.map(id => ({ id, name: `pokemon-${id}` })))

    const available = getAvailableChains(allButPikachu)

    expect(available.length).toBe(1)
    expect(available[0].name).toBe('Pikachu')
  })

  it('should handle case where current chain is the only available chain', () => {
    // Capture all chains except Eevee chain (partial)
    const eeveeChain = evolutionChains.find(c => c.name === 'Eevee')
    const currentChainIndex = evolutionChains.findIndex(c => c.name === 'Eevee')

    // Capture all pokemon except Jolteon (135)
    const captured = evolutionChains
      .flatMap(chain => chain.stages)
      .filter(id => id !== 135)
      .map(id => ({ id, name: `pokemon-${id}` }))

    const available = getAvailableChains(captured)

    // Only Eevee chain should be available (because Jolteon is uncaptured)
    expect(available.length).toBe(1)
    expect(available[0].name).toBe('Eevee')

    // Try to filter out current chain
    const eligibleChains = available.filter((chain) => {
      return evolutionChains.findIndex(c => c.name === chain.name) !== currentChainIndex
    })

    // Should be empty, so fallback to using available chains
    if (eligibleChains.length === 0) {
      expect(available.length).toBe(1)
      expect(available[0].name).toBe('Eevee')
    }
  })

  it('should handle all pokemon captured scenario', () => {
    const allPokemon = evolutionChains.flatMap(chain =>
      chain.stages.map(id => ({ id, name: `pokemon-${id}` }))
    )

    const available = getAvailableChains(allPokemon)
    expect(available.length).toBe(0)

    // Game should cycle through chains again or show completion
  })

  it('should validate each evolution chain has unique pokemon IDs', () => {
    const allIds = evolutionChains.flatMap(chain => chain.stages)
    const uniqueIds = new Set(allIds)

    expect(allIds.length).toBe(uniqueIds.size)
  })
})

describe('Edge Cases for Chain Switching', () => {
  it('should not trigger chain switch if not at max stage', () => {
    const chain = evolutionChains[0]
    const stage = 1 // Middle stage
    const health = 100
    const maxHP = 100

    expect(shouldEvolve(health, maxHP)).toBe(true)
    expect(isAtMaxStage(stage, chain)).toBe(false)
    // Should evolve within chain, not switch chains
  })

  it('should not trigger chain switch if HP not full', () => {
    const chain = evolutionChains[0]
    const stage = 2 // Max stage
    const health = 150
    const maxHP = 200

    expect(shouldEvolve(health, maxHP)).toBe(false)
    expect(isAtMaxStage(stage, chain)).toBe(true)
    // Should not do anything
  })

  it('should trigger chain switch only when both conditions met', () => {
    const chain = evolutionChains[0]
    const stage = 2 // Max stage
    const health = 200
    const maxHP = 200

    expect(shouldEvolve(health, maxHP)).toBe(true)
    expect(isAtMaxStage(stage, chain)).toBe(true)
    // Should trigger chain switch
  })
})
