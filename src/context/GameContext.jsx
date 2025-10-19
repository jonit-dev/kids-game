import { createContext, useContext, useState, useEffect } from 'react'

const GameContext = createContext()

export const useGame = () => {
  const context = useContext(GameContext)
  if (!context) {
    throw new Error('useGame must be used within a GameProvider')
  }
  return context
}

export const GameProvider = ({ children }) => {
  // Pokemon evolution chains - using PokeAPI IDs
  const evolutionChains = [
    // ===== GEN 1 KANTO (Red/Blue/Yellow) =====
    // Starters
    { name: 'Bulbasaur', stages: [1, 2, 3] },       // Bulbasaur -> Ivysaur -> Venusaur
    { name: 'Charmander', stages: [4, 5, 6] },      // Charmander -> Charmeleon -> Charizard
    { name: 'Squirtle', stages: [7, 8, 9] },        // Squirtle -> Wartortle -> Blastoise

    // Bug Types
    { name: 'Caterpie', stages: [10, 11, 12] },     // Caterpie -> Metapod -> Butterfree
    { name: 'Weedle', stages: [13, 14, 15] },       // Weedle -> Kakuna -> Beedrill

    // Flying Types
    { name: 'Pidgey', stages: [16, 17, 18] },       // Pidgey -> Pidgeotto -> Pidgeot
    { name: 'Spearow', stages: [21, 22, 142] },     // Spearow -> Fearow -> Aerodactyl

    // Normal Types
    { name: 'Rattata', stages: [19, 20, 143] },     // Rattata -> Raticate -> Snorlax

    // Poison Types
    { name: 'Ekans', stages: [23, 24, 169] },       // Ekans -> Arbok -> Crobat
    { name: 'Nidoran-F', stages: [29, 30, 31] },    // Nidoran♀ -> Nidorina -> Nidoqueen
    { name: 'Nidoran-M', stages: [32, 33, 34] },    // Nidoran♂ -> Nidorino -> Nidoking
    { name: 'Zubat', stages: [41, 42, 169] },       // Zubat -> Golbat -> Crobat
    { name: 'Grimer', stages: [88, 89, 569] },      // Grimer -> Muk -> Garbodor

    // Fairy Types
    { name: 'Clefairy', stages: [173, 35, 36] },    // Cleffa -> Clefairy -> Clefable
    { name: 'Jigglypuff', stages: [174, 39, 40] },  // Igglybuff -> Jigglypuff -> Wigglytuff

    // Fire Types
    { name: 'Vulpix', stages: [37, 38, 157] },      // Vulpix -> Ninetales -> Typhlosion
    { name: 'Growlithe', stages: [58, 59, 229] },   // Growlithe -> Arcanine -> Houndoom
    { name: 'Ponyta', stages: [77, 78, 257] },      // Ponyta -> Rapidash -> Blaziken

    // Water Types
    { name: 'Psyduck', stages: [54, 55, 134] },     // Psyduck -> Golduck -> Vaporeon
    { name: 'Poliwag', stages: [60, 61, 62] },      // Poliwag -> Poliwhirl -> Poliwrath
    { name: 'Tentacool', stages: [72, 73, 171] },   // Tentacool -> Tentacruel -> Lanturn
    { name: 'Slowpoke', stages: [79, 80, 199] },    // Slowpoke -> Slowbro -> Slowking
    { name: 'Seel', stages: [86, 87, 471] },        // Seel -> Dewgong -> Glaceon
    { name: 'Shellder', stages: [90, 91, 230] },    // Shellder -> Cloyster -> Kingdra
    { name: 'Krabby', stages: [98, 99, 342] },      // Krabby -> Kingler -> Crawdaunt
    { name: 'Horsea', stages: [116, 117, 230] },    // Horsea -> Seadra -> Kingdra
    { name: 'Goldeen', stages: [118, 119, 119] },   // Goldeen -> Seaking -> Seaking
    { name: 'Staryu', stages: [120, 121, 186] },    // Staryu -> Starmie -> Politoed
    { name: 'Magikarp', stages: [129, 130, 148] },  // Magikarp -> Gyarados -> Dragonair

    // Electric Types
    { name: 'Pikachu', stages: [172, 25, 26] },     // Pichu -> Pikachu -> Raichu
    { name: 'Magnemite', stages: [81, 82, 462] },   // Magnemite -> Magneton -> Magnezone
    { name: 'Voltorb', stages: [100, 101, 466] },   // Voltorb -> Electrode -> Electivire

    // Grass Types
    { name: 'Oddish', stages: [43, 44, 45] },       // Oddish -> Gloom -> Vileplume
    { name: 'Bellsprout', stages: [69, 70, 71] },   // Bellsprout -> Weepinbell -> Victreebel
    { name: 'Exeggcute', stages: [102, 103, 465] }, // Exeggcute -> Exeggutor -> Rhyperior
    { name: 'Tangela', stages: [114, 465, 389] },   // Tangela -> Rhyperior -> Torterra

    // Fighting Types
    { name: 'Mankey', stages: [56, 57, 392] },      // Mankey -> Primeape -> Infernape
    { name: 'Machop', stages: [66, 67, 68] },       // Machop -> Machoke -> Machamp
    { name: 'Hitmon', stages: [236, 106, 107] },    // Tyrogue -> Hitmonlee -> Hitmonchan

    // Psychic Types
    { name: 'Abra', stages: [63, 64, 65] },         // Abra -> Kadabra -> Alakazam
    { name: 'Drowzee', stages: [96, 97, 203] },     // Drowzee -> Hypno -> Girafarig
    { name: 'Mr-Mime', stages: [439, 122, 866] },   // Mime Jr -> Mr. Mime -> Mr. Rime

    // Ground Types
    { name: 'Sandshrew', stages: [27, 28, 76] },    // Sandshrew -> Sandslash -> Golem
    { name: 'Diglett', stages: [50, 51, 449] },     // Diglett -> Dugtrio -> Hippopotas
    { name: 'Geodude', stages: [74, 75, 76] },      // Geodude -> Graveler -> Golem
    { name: 'Cubone', stages: [104, 105, 464] },    // Cubone -> Marowak -> Rhyperior
    { name: 'Rhyhorn', stages: [111, 112, 464] },   // Rhyhorn -> Rhydon -> Rhyperior

    // Rock Types
    { name: 'Onix', stages: [95, 208, 476] },       // Onix -> Steelix -> Probopass
    { name: 'Kabuto', stages: [140, 141, 348] },    // Kabuto -> Kabutops -> Armaldo
    { name: 'Omanyte', stages: [138, 139, 141] },   // Omanyte -> Omastar -> Kabutops

    // Ghost Types
    { name: 'Gastly', stages: [92, 93, 94] },       // Gastly -> Haunter -> Gengar

    // Ice Types
    { name: 'Smoochum', stages: [238, 124, 478] },  // Smoochum -> Jynx -> Froslass

    // Dragon Types
    { name: 'Dratini', stages: [147, 148, 149] },   // Dratini -> Dragonair -> Dragonite

    // Eevee Evolutions (All 8!)
    { name: 'Eevee-Water', stages: [133, 134, 186] },    // Eevee -> Vaporeon -> Politoed
    { name: 'Eevee-Electric', stages: [133, 135, 466] }, // Eevee -> Jolteon -> Electivire
    { name: 'Eevee-Fire', stages: [133, 136, 467] },     // Eevee -> Flareon -> Magmortar
    { name: 'Eevee-Psychic', stages: [133, 196, 282] },  // Eevee -> Espeon -> Gardevoir
    { name: 'Eevee-Dark', stages: [133, 197, 430] },     // Eevee -> Umbreon -> Honchkrow
    { name: 'Eevee-Grass', stages: [133, 470, 389] },    // Eevee -> Leafeon -> Torterra
    { name: 'Eevee-Ice', stages: [133, 471, 478] },      // Eevee -> Glaceon -> Froslass
    { name: 'Eevee-Fairy', stages: [133, 700, 282] },    // Eevee -> Sylveon -> Gardevoir

    // Additional generations (shortened for brevity - include more as needed)
    { name: 'Chikorita', stages: [152, 153, 154] },
    { name: 'Cyndaquil', stages: [155, 156, 157] },
    { name: 'Totodile', stages: [158, 159, 160] },
  ]

  // Helper function to check if a chain has any uncaptured Pokemon
  const getAvailableChains = (captured) => {
    return evolutionChains.filter((chain) => {
      return chain.stages.some(pokemonId =>
        !captured.some(c => c.id === pokemonId)
      )
    })
  }

  // Initialize captured Pokemon from localStorage
  const [capturedPokemon, setCapturedPokemon] = useState(() => {
    const saved = localStorage.getItem('capturedPokemon')
    return saved ? JSON.parse(saved) : []
  })

  // Initialize with a chain that has uncaptured Pokemon
  const [currentChainIndex, setCurrentChainIndex] = useState(() => {
    const availableChains = getAvailableChains(capturedPokemon)
    if (availableChains.length === 0) {
      return Math.floor(Math.random() * evolutionChains.length)
    }
    const selectedChain = availableChains[Math.floor(Math.random() * availableChains.length)]
    return evolutionChains.findIndex(c => c.name === selectedChain.name)
  })

  const [score, setScore] = useState(0)
  const [level, setLevel] = useState(1)
  const [health, setHealth] = useState(0)
  const [pokemonStage, setPokemonStage] = useState(0)
  const [maxHP, setMaxHP] = useState(50)
  const [pokemonData, setPokemonData] = useState(null)
  const [selectedPokemon, setSelectedPokemon] = useState(null)
  const [showEvolution, setShowEvolution] = useState(false)
  const [showDevolution, setShowDevolution] = useState(false)
  const [showSwap, setShowSwap] = useState(false)

  const currentChain = evolutionChains[currentChainIndex]

  const fetchPokemon = async (pokemonId) => {
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`)
      const data = await response.json()
      setPokemonData(data)
      console.log('Pokemon loaded:', data.name)
    } catch (error) {
      console.error('Error fetching Pokemon:', error)
    }
  }

  // Load initial Pokemon
  useEffect(() => {
    console.log('Loading initial Pokemon, chain:', currentChain.name, 'stage:', pokemonStage, 'ID:', currentChain.stages[pokemonStage])
    fetchPokemon(currentChain.stages[pokemonStage])
  }, [])

  const getHealthColor = () => {
    const healthPercentage = (health / maxHP) * 100
    if (healthPercentage > 66) return '#4ECDC4' // Teal - healthy
    if (healthPercentage > 33) return '#FFD93D' // Yellow - warning
    return '#FF6B6B' // Red - danger
  }

  const handleCorrectAnswer = () => {
    const hpGain = 15
    const newHealth = Math.min(maxHP, health + hpGain)
    console.log(`HP Change: ${health} → ${newHealth} (+${hpGain})`)
    setHealth(newHealth)

    // Check if we should evolve or switch chains
    if (newHealth === maxHP) {
      const pokemonId = currentChain.stages[pokemonStage]
      const alreadyCaptured = capturedPokemon.some(p => p.id === pokemonId)

      console.log('Attempting to capture:', pokemonData.name, 'ID:', pokemonId, 'Already captured:', alreadyCaptured)

      let newCaptured = capturedPokemon
      if (!alreadyCaptured) {
        const captureEntry = {
          id: pokemonId,
          name: pokemonData.name,
          sprite: pokemonData.sprites.front_default,
          capturedAt: new Date().toISOString()
        }

        newCaptured = [...capturedPokemon, captureEntry]
        setCapturedPokemon(newCaptured)
        localStorage.setItem('capturedPokemon', JSON.stringify(newCaptured))
        console.log('✓ Captured new Pokemon:', pokemonData.name, 'Total captured:', newCaptured.length)
      } else {
        console.log('⨯ Skipped duplicate:', pokemonData.name)
      }

      // Check if we're at the max stage of current chain
      if (pokemonStage >= currentChain.stages.length - 1) {
        const availableChains = getAvailableChains(newCaptured)

        if (availableChains.length === 0) {
          const newChainIndex = (currentChainIndex + 1) % evolutionChains.length
          setCurrentChainIndex(newChainIndex)
          setPokemonStage(0)
          setLevel(level + 1)
          setHealth(0)
          setMaxHP(50)
          setShowSwap(true)

          setTimeout(() => {
            fetchPokemon(evolutionChains[newChainIndex].stages[0])
            setTimeout(() => {
              setShowSwap(false)
            }, 3000)
          }, 500)
        } else {
          let eligibleChains = availableChains.filter((chain) => {
            return evolutionChains.findIndex(c => c.name === chain.name) !== currentChainIndex
          })

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

          setTimeout(() => {
            fetchPokemon(evolutionChains[newChainIndex].stages[0])
            setTimeout(() => {
              setShowSwap(false)
            }, 3000)
          }, 500)
        }
      } else {
        const newStage = pokemonStage + 1
        const newLevel = level + 1
        setPokemonStage(newStage)
        setLevel(newLevel)
        setHealth(0)

        const newMaxHP = Math.floor(50 * Math.pow(2, newStage))
        setMaxHP(newMaxHP)

        setShowEvolution(true)

        setTimeout(() => {
          fetchPokemon(currentChain.stages[newStage])
          setTimeout(() => {
            setShowEvolution(false)
          }, 3000)
        }, 500)
      }
    }
  }

  const handleWrongAnswer = () => {
    const hpLoss = 20
    const newHealth = Math.max(0, health - hpLoss)
    console.log(`HP Change: ${health} → ${newHealth} (-${hpLoss})`)
    setHealth(newHealth)

    if (newHealth === 0 && pokemonStage > 0) {
      const newStage = pokemonStage - 1
      const newLevel = Math.max(1, level - 1)
      setPokemonStage(newStage)
      setLevel(newLevel)

      const newMaxHP = Math.floor(50 * Math.pow(2, newStage))
      setMaxHP(newMaxHP)

      setHealth(0)
      setShowDevolution(true)

      setTimeout(() => {
        fetchPokemon(currentChain.stages[newStage])
        setTimeout(() => {
          setShowDevolution(false)
        }, 3000)
      }, 500)
    }
  }

  const value = {
    score,
    setScore,
    level,
    health,
    maxHP,
    pokemonStage,
    pokemonData,
    capturedPokemon,
    selectedPokemon,
    setSelectedPokemon,
    showEvolution,
    showDevolution,
    showSwap,
    getHealthColor,
    handleCorrectAnswer,
    handleWrongAnswer,
  }

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>
}
