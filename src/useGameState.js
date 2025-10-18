import { useState, useCallback } from 'react'
import {
  evolutionChains,
  getAvailableChains,
  calculateNewHealth,
  calculateMaxHP,
  shouldEvolve,
  shouldDevolve,
  isAtMaxStage,
  isPokemonCaptured
} from './gameLogic'

// Custom hook to manage game state logic
export const useGameState = (initialChainIndex = 0, initialCaptured = []) => {
  const [pokemonStage, setPokemonStage] = useState(0)
  const [currentChainIndex, setCurrentChainIndex] = useState(initialChainIndex)
  const [health, setHealth] = useState(0)
  const [maxHP, setMaxHP] = useState(50)
  const [level, setLevel] = useState(1)
  const [capturedPokemon, setCapturedPokemon] = useState(initialCaptured)
  const [showEvolution, setShowEvolution] = useState(false)
  const [showDevolution, setShowDevolution] = useState(false)
  const [showSwap, setShowSwap] = useState(false)

  const currentChain = evolutionChains[currentChainIndex]
  const currentPokemonId = currentChain.stages[pokemonStage]

  // Handle correct answer
  const handleCorrectAnswer = useCallback(() => {
    const newHealth = calculateNewHealth(health, true, maxHP)
    setHealth(newHealth)

    // Check if we should evolve or switch chains
    if (shouldEvolve(newHealth, maxHP)) {
      // Capture the current Pokemon before evolution/switching
      const pokemonId = currentChain.stages[pokemonStage]
      const alreadyCaptured = isPokemonCaptured(pokemonId, capturedPokemon)

      let newCaptured = capturedPokemon
      if (!alreadyCaptured) {
        const captureEntry = {
          id: pokemonId,
          name: `pokemon-${pokemonId}`,
          capturedAt: new Date().toISOString()
        }
        newCaptured = [...capturedPokemon, captureEntry]
        setCapturedPokemon(newCaptured)
      }

      // Check if we're at the max stage of current chain
      if (isAtMaxStage(pokemonStage, currentChain)) {
        // Get available chains (ones with at least one uncaptured Pokemon)
        const availableChains = getAvailableChains(newCaptured)

        if (availableChains.length === 0) {
          // All Pokemon captured! Cycle through all chains again
          const newChainIndex = (currentChainIndex + 1) % evolutionChains.length
          setCurrentChainIndex(newChainIndex)
          setPokemonStage(0)
          setLevel(level + 1)
          setHealth(0)
          setMaxHP(50)
          setShowSwap(true)
          return { action: 'swap', newChainIndex, allCaptured: true }
        } else {
          // Select from available chains only
          let eligibleChains = availableChains.filter((chain) => {
            return evolutionChains.findIndex(c => c.name === chain.name) !== currentChainIndex
          })

          // If all available chains are the current chain, use any available
          if (eligibleChains.length === 0) {
            eligibleChains = availableChains
          }

          const selectedChain = eligibleChains[Math.floor(Math.random() * eligibleChains.length)]
          const newChainIndex = evolutionChains.findIndex(c => c.name === selectedChain.name)

          setCurrentChainIndex(newChainIndex)
          setPokemonStage(0)
          setLevel(level + 1)
          setHealth(0)
          setMaxHP(50)
          setShowSwap(true)
          return { action: 'swap', newChainIndex, selectedChain: selectedChain.name }
        }
      } else {
        // Normal evolution within current chain
        const newStage = pokemonStage + 1
        const newLevel = level + 1
        setPokemonStage(newStage)
        setLevel(newLevel)
        setHealth(0)

        const newMaxHP = calculateMaxHP(newStage)
        setMaxHP(newMaxHP)
        setShowEvolution(true)
        return { action: 'evolve', newStage, newMaxHP }
      }
    }

    return { action: 'none', newHealth }
  }, [health, maxHP, pokemonStage, currentChain, capturedPokemon, currentChainIndex, level])

  // Handle wrong answer
  const handleWrongAnswer = useCallback(() => {
    const newHealth = calculateNewHealth(health, false, maxHP)
    setHealth(newHealth)

    // Devolve when health reaches 0 and not at first stage
    if (shouldDevolve(newHealth, pokemonStage)) {
      const newStage = pokemonStage - 1
      const newLevel = Math.max(1, level - 1)
      setPokemonStage(newStage)
      setLevel(newLevel)

      const newMaxHP = calculateMaxHP(newStage)
      setMaxHP(newMaxHP)
      setHealth(0)
      setShowDevolution(true)
      return { action: 'devolve', newStage, newMaxHP }
    }

    return { action: 'none', newHealth }
  }, [health, maxHP, pokemonStage, level])

  const resetAnimations = useCallback(() => {
    setShowEvolution(false)
    setShowDevolution(false)
    setShowSwap(false)
  }, [])

  return {
    // State
    pokemonStage,
    currentChainIndex,
    currentChain,
    currentPokemonId,
    health,
    maxHP,
    level,
    capturedPokemon,
    showEvolution,
    showDevolution,
    showSwap,
    // Actions
    handleCorrectAnswer,
    handleWrongAnswer,
    resetAnimations,
    // Setters for testing
    setPokemonStage,
    setHealth,
    setMaxHP,
    setCapturedPokemon,
    setCurrentChainIndex,
    setLevel
  }
}
