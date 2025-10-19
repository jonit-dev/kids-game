import { useState, useEffect } from 'react'
import { MdSkipNext, MdVolumeUp } from 'react-icons/md'
import './App.css'
import { getRandomWord, getSpellingPoints } from './wordData'
import { useSpeech } from './useSpeech'

function App() {
  // Mode selection state
  const [showModeSelection, setShowModeSelection] = useState(true)

  // Game mode: 'math', 'spelling', or 'memory'
  const [gameMode, setGameMode] = useState('math')

  // Math mode state
  const [num1, setNum1] = useState(0)
  const [num2, setNum2] = useState(0)
  const [operation, setOperation] = useState('+')

  // Spelling mode state
  const [currentWord, setCurrentWord] = useState(null)
  const [showSpellingHint, setShowSpellingHint] = useState(false)
  const [spellingAttempts, setSpellingAttempts] = useState(0)

  // Memory game state
  const [memoryCards, setMemoryCards] = useState([])
  const [flippedCards, setFlippedCards] = useState([])
  const [matchedCards, setMatchedCards] = useState([])
  const [wrongMatchCards, setWrongMatchCards] = useState([])
  const [memoryMoves, setMemoryMoves] = useState(0)
  const [memoryDifficulty, setMemoryDifficulty] = useState('easy') // easy, medium, hard
  const [memoryTimer, setMemoryTimer] = useState(0)
  const [memoryTimerActive, setMemoryTimerActive] = useState(false)
  const [bestTimes, setBestTimes] = useState(() => {
    const saved = localStorage.getItem('memoryBestTimes')
    return saved ? JSON.parse(saved) : { easy: null, medium: null, hard: null }
  })

  // Shared state
  const [answer, setAnswer] = useState('')
  const [score, setScore] = useState(0)
  const [message, setMessage] = useState('Let\'s learn!')
  const [showCelebration, setShowCelebration] = useState(false)
  const [currentEmoji, setCurrentEmoji] = useState('🍎')
  const [currentQuestionDifficulty, setCurrentQuestionDifficulty] = useState('easy')
  const [level, setLevel] = useState(1)
  const [health, setHealth] = useState(0) // Health bar starts at 0 (0-maxHP)
  const [pokemonStage, setPokemonStage] = useState(0)
  const [showEvolution, setShowEvolution] = useState(false)
  const [showDevolution, setShowDevolution] = useState(false)
  const [showSwap, setShowSwap] = useState(false)
  const [pokemonData, setPokemonData] = useState(null)
  const [selectedPokemon, setSelectedPokemon] = useState(null)
  const [capturedPokemon, setCapturedPokemon] = useState(() => {
    const saved = localStorage.getItem('capturedPokemon')
    return saved ? JSON.parse(saved) : []
  })
  const [maxHP, setMaxHP] = useState(50) // Exponentially increasing HP requirement
  const [isProcessingAnswer, setIsProcessingAnswer] = useState(false) // Prevent multiple submissions

  // Text-to-speech hook
  const { speakWord, spellOut, isSupported: isSpeechSupported, voicesReady, isBlocked } = useSpeech()

  // Pokemon evolution chains - using PokeAPI IDs (Verified with PokeAPI)
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

    // ===== GEN 2 JOHTO (Gold/Silver/Crystal) =====
    // Starters
    { name: 'Chikorita', stages: [152, 153, 154] }, // Chikorita -> Bayleef -> Meganium
    { name: 'Cyndaquil', stages: [155, 156, 157] }, // Cyndaquil -> Quilava -> Typhlosion
    { name: 'Totodile', stages: [158, 159, 160] },  // Totodile -> Croconaw -> Feraligatr

    // Normal Types
    { name: 'Sentret', stages: [161, 162, 242] },   // Sentret -> Furret -> Blissey
    { name: 'Hoothoot', stages: [163, 164, 468] },  // Hoothoot -> Noctowl -> Togekiss
    { name: 'Aipom', stages: [190, 424, 289] },     // Aipom -> Ambipom -> Slaking

    // Bug Types
    { name: 'Ledyba', stages: [165, 166, 469] },    // Ledyba -> Ledian -> Yanmega
    { name: 'Spinarak', stages: [167, 168, 168] },  // Spinarak -> Ariados -> Ariados
    { name: 'Pineco', stages: [204, 205, 212] },    // Pineco -> Forretress -> Scizor
    { name: 'Heracross', stages: [214, 214, 214] }, // Heracross -> Heracross -> Heracross
    { name: 'Wurmple', stages: [265, 266, 267] },   // Wurmple -> Silcoon -> Beautifly

    // Water Types
    { name: 'Chinchou', stages: [170, 171, 593] },  // Chinchou -> Lanturn -> Jellicent
    { name: 'Marill', stages: [298, 183, 184] },    // Azurill -> Marill -> Azumarill
    { name: 'Wooper', stages: [194, 195, 618] },    // Wooper -> Quagsire -> Stunfisk
    { name: 'Qwilfish', stages: [211, 211, 211] },  // Qwilfish -> Qwilfish -> Qwilfish
    { name: 'Remoraid', stages: [223, 224, 226] },  // Remoraid -> Octillery -> Mantine

    // Electric Types
    { name: 'Mareep', stages: [179, 180, 181] },    // Mareep -> Flaaffy -> Ampharos
    { name: 'Elekid', stages: [239, 125, 466] },    // Elekid -> Electabuzz -> Electivire

    // Grass Types
    { name: 'Hoppip', stages: [187, 188, 189] },    // Hoppip -> Skiploom -> Jumpluff
    { name: 'Sunkern', stages: [191, 192, 470] },   // Sunkern -> Sunflora -> Leafeon

    // Fire Types
    { name: 'Magby', stages: [240, 126, 467] },     // Magby -> Magmar -> Magmortar
    { name: 'Slugma', stages: [218, 219, 323] },    // Slugma -> Magcargo -> Camerupt

    // Psychic Types
    { name: 'Natu', stages: [177, 178, 561] },      // Natu -> Xatu -> Sigilyph
    { name: 'Wynaut', stages: [360, 202, 203] },    // Wynaut -> Wobbuffet -> Girafarig
    { name: 'Smoochum-2', stages: [238, 124, 282] },// Smoochum -> Jynx -> Gardevoir

    // Ground/Rock Types
    { name: 'Phanpy', stages: [231, 232, 450] },    // Phanpy -> Donphan -> Hippowdon
    { name: 'Larvitar', stages: [246, 247, 248] },  // Larvitar -> Pupitar -> Tyranitar

    // Steel Types
    { name: 'Skarmory', stages: [227, 227, 227] },  // Skarmory -> Skarmory -> Skarmory

    // Dark Types
    { name: 'Sneasel', stages: [215, 461, 903] },   // Sneasel -> Weavile -> Meowscarada
    { name: 'Houndour', stages: [228, 229, 262] },  // Houndour -> Houndoom -> Mightyena
    { name: 'Murkrow', stages: [198, 430, 630] },   // Murkrow -> Honchkrow -> Mandibuzz

    // ===== GEN 3 HOENN (Ruby/Sapphire/Emerald) =====
    // Starters
    { name: 'Treecko', stages: [252, 253, 254] },   // Treecko -> Grovyle -> Sceptile
    { name: 'Torchic', stages: [255, 256, 257] },   // Torchic -> Combusken -> Blaziken
    { name: 'Mudkip', stages: [258, 259, 260] },    // Mudkip -> Marshtomp -> Swampert

    // Normal Types
    { name: 'Zigzagoon', stages: [263, 264, 289] }, // Zigzagoon -> Linoone -> Slaking
    { name: 'Taillow', stages: [276, 277, 398] },   // Taillow -> Swellow -> Staraptor
    { name: 'Whismur', stages: [293, 294, 295] },   // Whismur -> Loudred -> Exploud
    { name: 'Azurill', stages: [298, 183, 184] },   // Azurill -> Marill -> Azumarill
    { name: 'Skitty', stages: [300, 301, 509] },    // Skitty -> Delcatty -> Purrloin

    // Bug Types
    { name: 'Wurmple-B', stages: [265, 268, 269] }, // Wurmple -> Cascoon -> Dustox
    { name: 'Nincada', stages: [290, 291, 292] },   // Nincada -> Ninjask -> Shedinja
    { name: 'Volbeat', stages: [313, 313, 313] },   // Volbeat -> Volbeat -> Volbeat

    // Water Types
    { name: 'Lotad', stages: [270, 271, 272] },     // Lotad -> Lombre -> Ludicolo
    { name: 'Surskit', stages: [283, 284, 545] },   // Surskit -> Masquerain -> Scolipede
    { name: 'Corphish', stages: [341, 342, 130] },  // Corphish -> Crawdaunt -> Gyarados
    { name: 'Feebas', stages: [349, 350, 130] },    // Feebas -> Milotic -> Gyarados
    { name: 'Clamperl', stages: [366, 367, 368] },  // Clamperl -> Huntail -> Gorebyss
    { name: 'Wailmer', stages: [320, 321, 131] },   // Wailmer -> Wailord -> Lapras

    // Grass Types
    { name: 'Seedot', stages: [273, 274, 275] },    // Seedot -> Nuzleaf -> Shiftry
    { name: 'Shroomish', stages: [285, 286, 591] }, // Shroomish -> Breloom -> Amoonguss
    { name: 'Cacnea', stages: [331, 332, 389] },    // Cacnea -> Cacturne -> Torterra
    { name: 'Lileep', stages: [345, 346, 699] },    // Lileep -> Cradily -> Aurorus
    { name: 'Tropius', stages: [357, 357, 357] },   // Tropius -> Tropius -> Tropius

    // Fire Types
    { name: 'Numel', stages: [322, 323, 324] },     // Numel -> Camerupt -> Torkoal

    // Electric Types
    { name: 'Electrike', stages: [309, 310, 181] }, // Electrike -> Manectric -> Ampharos
    { name: 'Plusle', stages: [311, 311, 311] },    // Plusle -> Plusle -> Plusle
    { name: 'Minun', stages: [312, 312, 312] },     // Minun -> Minun -> Minun

    // Fighting Types
    { name: 'Makuhita', stages: [296, 297, 68] },   // Makuhita -> Hariyama -> Machamp
    { name: 'Meditite', stages: [307, 308, 392] },  // Meditite -> Medicham -> Infernape

    // Psychic Types
    { name: 'Ralts', stages: [280, 281, 282] },     // Ralts -> Kirlia -> Gardevoir
    { name: 'Spoink', stages: [325, 326, 561] },    // Spoink -> Grumpig -> Sigilyph
    { name: 'Baltoy', stages: [343, 344, 563] },    // Baltoy -> Claydol -> Cofagrigus

    // Ground Types
    { name: 'Trapinch', stages: [328, 329, 330] },  // Trapinch -> Vibrava -> Flygon
    { name: 'Barboach', stages: [339, 340, 618] },  // Barboach -> Whiscash -> Stunfisk

    // Rock Types
    { name: 'Nosepass', stages: [299, 476, 208] },  // Nosepass -> Probopass -> Steelix
    { name: 'Anorith', stages: [347, 348, 464] },   // Anorith -> Armaldo -> Rhyperior

    // Steel Types
    { name: 'Aron', stages: [304, 305, 306] },      // Aron -> Lairon -> Aggron
    { name: 'Beldum', stages: [374, 375, 376] },    // Beldum -> Metang -> Metagross

    // Dragon Types
    { name: 'Bagon', stages: [371, 372, 373] },     // Bagon -> Shelgon -> Salamence

    // Dark Types
    { name: 'Poochyena', stages: [261, 262, 635] }, // Poochyena -> Mightyena -> Hydreigon
    { name: 'Carvanha', stages: [318, 319, 160] },  // Carvanha -> Sharpedo -> Feraligatr
    { name: 'Absol', stages: [359, 359, 359] },     // Absol -> Absol -> Absol

    // ===== GEN 4 SINNOH (Diamond/Pearl/Platinum) =====
    // Starters
    { name: 'Turtwig', stages: [387, 388, 389] },   // Turtwig -> Grotle -> Torterra
    { name: 'Chimchar', stages: [390, 391, 392] },  // Chimchar -> Monferno -> Infernape
    { name: 'Piplup', stages: [393, 394, 395] },    // Piplup -> Prinplup -> Empoleon

    // Normal Types
    { name: 'Starly', stages: [396, 397, 398] },    // Starly -> Staravia -> Staraptor
    { name: 'Bidoof', stages: [399, 400, 424] },    // Bidoof -> Bibarel -> Ambipom
    { name: 'Buneary', stages: [427, 428, 468] },   // Buneary -> Lopunny -> Togekiss
    { name: 'Glameow', stages: [431, 432, 510] },   // Glameow -> Purugly -> Liepard
    { name: 'Chatot', stages: [441, 441, 441] },    // Chatot -> Chatot -> Chatot

    // Bug Types
    { name: 'Kricketot', stages: [401, 402, 469] }, // Kricketot -> Kricketune -> Yanmega
    { name: 'Burmy', stages: [412, 413, 414] },     // Burmy -> Wormadam -> Mothim
    { name: 'Combee', stages: [415, 416, 545] },    // Combee -> Vespiquen -> Scolipede

    // Water Types
    { name: 'Buizel', stages: [418, 419, 160] },    // Buizel -> Floatzel -> Feraligatr
    { name: 'Shellos', stages: [422, 423, 171] },   // Shellos -> Gastrodon -> Lanturn
    { name: 'Finneon', stages: [456, 457, 350] },   // Finneon -> Lumineon -> Milotic
    { name: 'Mantyke', stages: [458, 226, 593] },   // Mantyke -> Mantine -> Jellicent

    // Grass Types
    { name: 'Cherubi', stages: [420, 421, 389] },   // Cherubi -> Cherrim -> Torterra
    { name: 'Carnivine', stages: [455, 455, 455] }, // Carnivine -> Carnivine -> Carnivine
    { name: 'Snover', stages: [459, 460, 478] },    // Snover -> Abomasnow -> Froslass

    // Fire Types
    { name: 'Ponyta-Galar', stages: [77, 78, 467] },// Ponyta -> Rapidash -> Magmortar

    // Electric Types
    { name: 'Shinx', stages: [403, 404, 405] },     // Shinx -> Luxio -> Luxray
    { name: 'Pachirisu', stages: [417, 417, 417] }, // Pachirisu -> Pachirisu -> Pachirisu
    { name: 'Rotom', stages: [479, 479, 479] },     // Rotom -> Rotom -> Rotom

    // Fighting Types
    { name: 'Riolu', stages: [447, 448, 539] },     // Riolu -> Lucario -> Sawk
    { name: 'Croagunk', stages: [453, 454, 537] },  // Croagunk -> Toxicroak -> Seismitoad

    // Psychic Types
    { name: 'Chingling', stages: [433, 358, 561] }, // Chingling -> Chimecho -> Sigilyph
    { name: 'Bronzor', stages: [436, 437, 563] },   // Bronzor -> Bronzong -> Cofagrigus

    // Ground Types
    { name: 'Gible', stages: [443, 444, 445] },     // Gible -> Gabite -> Garchomp
    { name: 'Hippopotas', stages: [449, 450, 530] },// Hippopotas -> Hippowdon -> Excadrill

    // Rock Types
    { name: 'Cranidos', stages: [408, 409, 697] },  // Cranidos -> Rampardos -> Tyrantrum
    { name: 'Shieldon', stages: [410, 411, 699] },  // Shieldon -> Bastiodon -> Aurorus

    // Dragon Types
    { name: 'Galar-Stunfisk', stages: [618, 618, 618] }, // Stunfisk -> Stunfisk -> Stunfisk

    // Dark Types
    { name: 'Stunky', stages: [434, 435, 569] },    // Stunky -> Skuntank -> Garbodor
    { name: 'Skorupi', stages: [451, 452, 748] },   // Skorupi -> Drapion -> Toxapex

    // ===== GEN 5 UNOVA (Black/White) =====
    // Starters
    { name: 'Snivy', stages: [495, 496, 497] },     // Snivy -> Servine -> Serperior
    { name: 'Tepig', stages: [498, 499, 500] },     // Tepig -> Pignite -> Emboar
    { name: 'Oshawott', stages: [501, 502, 503] },  // Oshawott -> Dewott -> Samurott

    // Normal Types
    { name: 'Patrat', stages: [504, 505, 424] },    // Patrat -> Watchog -> Ambipom
    { name: 'Lillipup', stages: [506, 507, 508] },  // Lillipup -> Herdier -> Stoutland
    { name: 'Pidove', stages: [519, 520, 521] },    // Pidove -> Tranquill -> Unfezant
    { name: 'Minccino', stages: [572, 573, 573] },  // Minccino -> Cinccino -> Cinccino

    // Bug Types
    { name: 'Sewaddle', stages: [540, 541, 542] },  // Sewaddle -> Swadloon -> Leavanny
    { name: 'Venipede', stages: [543, 544, 545] },  // Venipede -> Whirlipede -> Scolipede
    { name: 'Karrablast', stages: [588, 589, 212] },// Karrablast -> Escavalier -> Scizor
    { name: 'Joltik', stages: [595, 596, 738] },    // Joltik -> Galvantula -> Vikavolt
    { name: 'Shelmet', stages: [616, 617, 214] },   // Shelmet -> Accelgor -> Heracross

    // Water Types
    { name: 'Panpour', stages: [515, 516, 134] },   // Panpour -> Simipour -> Vaporeon
    { name: 'Ducklett', stages: [580, 581, 581] },  // Ducklett -> Swanna -> Swanna
    { name: 'Tympole', stages: [535, 536, 537] },   // Tympole -> Palpitoad -> Seismitoad
    { name: 'Basculin', stages: [550, 550, 550] },  // Basculin -> Basculin -> Basculin
    { name: 'Tirtouga', stages: [564, 565, 99] },   // Tirtouga -> Carracosta -> Kingler
    { name: 'Frillish', stages: [592, 593, 593] },  // Frillish -> Jellicent -> Jellicent

    // Grass Types
    { name: 'Pansage', stages: [511, 512, 470] },   // Pansage -> Simisage -> Leafeon
    { name: 'Petilil', stages: [548, 549, 182] },   // Petilil -> Lilligant -> Bellossom
    { name: 'Maractus', stages: [556, 556, 556] },  // Maractus -> Maractus -> Maractus
    { name: 'Deerling', stages: [585, 586, 586] },  // Deerling -> Sawsbuck -> Sawsbuck
    { name: 'Foongus', stages: [590, 591, 756] },   // Foongus -> Amoonguss -> Shiinotic

    // Fire Types
    { name: 'Pansear', stages: [513, 514, 136] },   // Pansear -> Simisear -> Flareon
    { name: 'Darumaka', stages: [554, 555, 555] },  // Darumaka -> Darmanitan -> Darmanitan
    { name: 'Litwick', stages: [607, 608, 609] },   // Litwick -> Lampent -> Chandelure

    // Electric Types
    { name: 'Blitzle', stages: [522, 523, 523] },   // Blitzle -> Zebstrika -> Zebstrika
    { name: 'Emolga', stages: [587, 587, 587] },    // Emolga -> Emolga -> Emolga
    { name: 'Tynamo', stages: [602, 603, 604] },    // Tynamo -> Eelektrik -> Eelektross

    // Fighting Types
    { name: 'Timburr', stages: [532, 533, 534] },   // Timburr -> Gurdurr -> Conkeldurr
    { name: 'Throh', stages: [538, 538, 538] },     // Throh -> Throh -> Throh
    { name: 'Sawk', stages: [539, 539, 539] },      // Sawk -> Sawk -> Sawk
    { name: 'Scraggy', stages: [559, 560, 620] },   // Scraggy -> Scrafty -> Mienfoo
    { name: 'Mienfoo', stages: [619, 620, 392] },   // Mienfoo -> Mienshao -> Infernape

    // Psychic Types
    { name: 'Munna', stages: [517, 518, 518] },     // Munna -> Musharna -> Musharna
    { name: 'Woobat', stages: [527, 528, 169] },    // Woobat -> Swoobat -> Crobat
    { name: 'Gothita', stages: [574, 575, 576] },   // Gothita -> Gothorita -> Gothitelle
    { name: 'Solosis', stages: [577, 578, 579] },   // Solosis -> Duosion -> Reuniclus
    { name: 'Elgyem', stages: [605, 606, 606] },    // Elgyem -> Beheeyem -> Beheeyem
    { name: 'Sigilyph', stages: [561, 561, 561] },  // Sigilyph -> Sigilyph -> Sigilyph

    // Ground Types
    { name: 'Sandile', stages: [551, 552, 553] },   // Sandile -> Krokorok -> Krookodile
    { name: 'Drilbur', stages: [529, 530, 464] },   // Drilbur -> Excadrill -> Rhyperior

    // Rock Types
    { name: 'Roggenrola', stages: [524, 525, 526] },// Roggenrola -> Boldore -> Gigalith
    { name: 'Dwebble', stages: [557, 558, 558] },   // Dwebble -> Crustle -> Crustle
    { name: 'Archen', stages: [566, 567, 142] },    // Archen -> Archeops -> Aerodactyl

    // Steel Types
    { name: 'Klink', stages: [599, 600, 601] },     // Klink -> Klang -> Klinklang
    { name: 'Ferroseed', stages: [597, 598, 598] }, // Ferroseed -> Ferrothorn -> Ferrothorn

    // Dragon Types
    { name: 'Axew', stages: [610, 611, 612] },      // Axew -> Fraxure -> Haxorus
    { name: 'Druddigon', stages: [621, 621, 621] }, // Druddigon -> Druddigon -> Druddigon
    { name: 'Deino', stages: [633, 634, 635] },     // Deino -> Zweilous -> Hydreigon

    // Dark Types
    { name: 'Purrloin', stages: [509, 510, 510] },  // Purrloin -> Liepard -> Liepard
    { name: 'Sandile-Dark', stages: [551, 552, 553] }, // Sandile -> Krokorok -> Krookodile
    { name: 'Zorua', stages: [570, 571, 571] },     // Zorua -> Zoroark -> Zoroark
    { name: 'Vullaby', stages: [629, 630, 630] },   // Vullaby -> Mandibuzz -> Mandibuzz
    { name: 'Pawniard', stages: [624, 625, 625] },  // Pawniard -> Bisharp -> Bisharp

    // Ghost Types
    { name: 'Yamask', stages: [562, 563, 94] },     // Yamask -> Cofagrigus -> Gengar
    { name: 'Litwick-Ghost', stages: [607, 608, 609] }, // Litwick -> Lampent -> Chandelure

    // ===== GEN 6 KALOS (X/Y) =====
    // Starters
    { name: 'Chespin', stages: [650, 651, 652] },   // Chespin -> Quilladin -> Chesnaught
    { name: 'Fennekin', stages: [653, 654, 655] },  // Fennekin -> Braixen -> Delphox
    { name: 'Froakie', stages: [656, 657, 658] },   // Froakie -> Frogadier -> Greninja

    // Normal Types
    { name: 'Bunnelby', stages: [659, 660, 660] },  // Bunnelby -> Diggersby -> Diggersby
    { name: 'Fletchling', stages: [661, 662, 663] },// Fletchling -> Fletchinder -> Talonflame
    { name: 'Litleo', stages: [667, 668, 668] },    // Litleo -> Pyroar -> Pyroar
    { name: 'Furfrou', stages: [676, 676, 676] },   // Furfrou -> Furfrou -> Furfrou

    // Bug Types
    { name: 'Scatterbug', stages: [664, 665, 666] },// Scatterbug -> Spewpa -> Vivillon

    // Water Types
    { name: 'Clauncher', stages: [692, 693, 693] }, // Clauncher -> Clawitzer -> Clawitzer
    { name: 'Skrelp', stages: [690, 691, 171] },    // Skrelp -> Dragalge -> Lanturn

    // Grass Types
    { name: 'Skiddo', stages: [672, 673, 673] },    // Skiddo -> Gogoat -> Gogoat
    { name: 'Phantump', stages: [708, 709, 709] },  // Phantump -> Trevenant -> Trevenant

    // Dragon Types
    { name: 'Goomy', stages: [704, 705, 706] },     // Goomy -> Sliggoo -> Goodra
    { name: 'Noibat', stages: [714, 715, 715] },    // Noibat -> Noivern -> Noivern

    // Dark Types
    { name: 'Inkay', stages: [686, 687, 687] },     // Inkay -> Malamar -> Malamar
    { name: 'Pancham', stages: [674, 675, 675] },   // Pancham -> Pangoro -> Pangoro

    // ===== GEN 7 ALOLA (Sun/Moon) =====
    // Starters
    { name: 'Rowlet', stages: [722, 723, 724] },    // Rowlet -> Dartrix -> Decidueye
    { name: 'Litten', stages: [725, 726, 727] },    // Litten -> Torracat -> Incineroar
    { name: 'Popplio', stages: [728, 729, 730] },   // Popplio -> Brionne -> Primarina

    // Normal Types
    { name: 'Yungoos', stages: [734, 735, 735] },   // Yungoos -> Gumshoos -> Gumshoos
    { name: 'Pikipek', stages: [731, 732, 733] },   // Pikipek -> Trumbeak -> Toucannon
    { name: 'Stufful', stages: [759, 760, 760] },   // Stufful -> Bewear -> Bewear

    // Bug Types
    { name: 'Grubbin', stages: [736, 737, 738] },   // Grubbin -> Charjabug -> Vikavolt
    { name: 'Wimpod', stages: [767, 768, 768] },    // Wimpod -> Golisopod -> Golisopod

    // Water Types
    { name: 'Wishiwashi', stages: [746, 746, 746] },// Wishiwashi -> Wishiwashi -> Wishiwashi
    { name: 'Mareanie', stages: [747, 748, 748] },  // Mareanie -> Toxapex -> Toxapex
    { name: 'Dewpider', stages: [751, 752, 752] },  // Dewpider -> Araquanid -> Araquanid

    // Grass Types
    { name: 'Bounsweet', stages: [761, 762, 763] }, // Bounsweet -> Steenee -> Tsareena
    { name: 'Morelull', stages: [755, 756, 591] },  // Morelull -> Shiinotic -> Amoonguss

    // Fire Types
    { name: 'Salandit', stages: [757, 758, 758] },  // Salandit -> Salazzle -> Salazzle

    // Electric Types
    { name: 'Togedemaru', stages: [777, 777, 777] },// Togedemaru -> Togedemaru -> Togedemaru

    // Psychic Types
    { name: 'Cosmog', stages: [789, 790, 791] },    // Cosmog -> Cosmoem -> Solgaleo

    // Ground Types
    { name: 'Mudbray', stages: [749, 750, 750] },   // Mudbray -> Mudsdale -> Mudsdale
    { name: 'Sandygast', stages: [769, 770, 770] }, // Sandygast -> Palossand -> Palossand

    // Rock Types
    { name: 'Rockruff', stages: [744, 745, 745] },  // Rockruff -> Lycanroc -> Lycanroc
    { name: 'Minior', stages: [774, 774, 774] },    // Minior -> Minior -> Minior

    // Dragon Types
    { name: 'Jangmo-o', stages: [782, 783, 784] },  // Jangmo-o -> Hakamo-o -> Kommo-o

    // Dark Types
    { name: 'Alola-Rattata', stages: [19, 20, 510] } // Rattata -> Raticate -> Liepard
  ]

  // Helper function to check if a chain has any uncaptured Pokemon
  const getAvailableChains = (captured) => {
    return evolutionChains.filter((chain) => {
      // A chain is available if at least one Pokemon in it is NOT captured
      return chain.stages.some(pokemonId =>
        !captured.some(c => c.id === pokemonId)
      )
    })
  }

  // Initialize with a chain that has uncaptured Pokemon
  const [currentChainIndex, setCurrentChainIndex] = useState(() => {
    const availableChains = getAvailableChains(
      JSON.parse(localStorage.getItem('capturedPokemon') || '[]')
    )
    if (availableChains.length === 0) {
      // All Pokemon captured - start fresh or pick any chain
      return Math.floor(Math.random() * evolutionChains.length)
    }
    // Find the index of the first available chain in the original array
    const selectedChain = availableChains[Math.floor(Math.random() * availableChains.length)]
    return evolutionChains.findIndex(c => c.name === selectedChain.name)
  })
  const currentChain = evolutionChains[currentChainIndex]

  const getHealthColor = () => {
    const healthPercentage = (health / maxHP) * 100
    if (healthPercentage > 66) return '#4ECDC4' // Teal - healthy
    if (healthPercentage > 33) return '#FFD93D' // Yellow - warning
    return '#FF6B6B' // Red - danger
  }

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

  // Visual representations - fun objects for kids to count
  const visualObjects = [
    '🍎', '🍌', '🍊', '🍇', '🍓',
    '⚽', '🎈', '⭐', '🌸', '🦋',
    '🐠', '🐢', '🐶', '🐱', '🐰'
  ]

  const VisualCounter = ({ count, crossOut = false }) => {
    return (
      <div className="visual-counter">
        {[...Array(count)].map((_, i) => (
          <span
            key={i}
            className={`visual-object ${crossOut ? 'crossed-out' : ''}`}
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            {currentEmoji}
          </span>
        ))}
      </div>
    )
  }

  const getDifficultyRanges = (op, diff, currentLevel) => {
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

  const getScoreForDifficulty = (diff) => {
    return { easy: 1, medium: 2, hard: 3 }[diff]
  }

  const getOperationsForDifficulty = (diff) => {
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

  const generateSpellingWord = () => {
    const word = getRandomWord(level)
    setCurrentWord(word)
    setCurrentEmoji(word.hint)
    setAnswer('')
    setShowSpellingHint(false)
    setSpellingAttempts(0)
    setMessage('Listen and spell the word!')

    // Automatically speak the word after a short delay
    setTimeout(() => {
      speakWord(word.word)
    }, 500)
  }

  const generateProblem = () => {
    // Determine difficulty based on level - progressively harder as level increases
    let randomDifficulty
    if (level <= 3) {
      // Levels 1-3: Only easy
      randomDifficulty = 'easy'
    } else if (level <= 6) {
      // Levels 4-6: Easy and medium
      randomDifficulty = Math.random() < 0.5 ? 'easy' : 'medium'
    } else if (level <= 10) {
      // Levels 7-10: Medium and some hard
      const rand = Math.random()
      if (rand < 0.3) randomDifficulty = 'easy'
      else if (rand < 0.7) randomDifficulty = 'medium'
      else randomDifficulty = 'hard'
    } else {
      // Level 11+: All difficulties with more hard questions
      const rand = Math.random()
      if (rand < 0.2) randomDifficulty = 'easy'
      else if (rand < 0.5) randomDifficulty = 'medium'
      else randomDifficulty = 'hard'
    }
    setCurrentQuestionDifficulty(randomDifficulty)

    const availableOps = getOperationsForDifficulty(randomDifficulty)
    const newOp = availableOps[Math.floor(Math.random() * availableOps.length)]
    const range = getDifficultyRanges(newOp, randomDifficulty, level)

    let n1, n2

    if (newOp === '÷') {
      // For division, ensure clean division
      n2 = Math.floor(Math.random() * (range.n2[1] - range.n2[0] + 1)) + range.n2[0]
      const multiplier = Math.floor(Math.random() * (range.n1[1] - range.n1[0] + 1)) + range.n1[0]
      n1 = n2 * multiplier
    } else if (newOp === '-') {
      n1 = Math.floor(Math.random() * (range.n1[1] - range.n1[0] + 1)) + range.n1[0]
      n2 = Math.floor(Math.random() * Math.min(n1, range.n2[1])) + range.n2[0]
      n2 = Math.min(n2, n1) // Ensure no negative results
    } else {
      n1 = Math.floor(Math.random() * (range.n1[1] - range.n1[0] + 1)) + range.n1[0]
      n2 = Math.floor(Math.random() * (range.n2[1] - range.n2[0] + 1)) + range.n2[0]
    }

    // Pick a random emoji for this problem
    const randomEmoji = visualObjects[Math.floor(Math.random() * visualObjects.length)]
    setCurrentEmoji(randomEmoji)

    setNum1(n1)
    setNum2(n2)
    setOperation(newOp)
    setAnswer('')
    setMessage('Try this one!')
  }

  const generateQuestion = () => {
    if (gameMode === 'spelling') {
      generateSpellingWord()
    } else if (gameMode === 'memory') {
      generateMemoryGame()
    } else {
      generateProblem()
    }
  }

  const handleModeSelection = (mode) => {
    setGameMode(mode)
    setShowModeSelection(false)
    setScore(0)
    setHealth(0)
    setLevel(1)
    setPokemonStage(0)
    setMaxHP(50)
    setMessage('Let\'s learn!')
  }

  const generateMemoryGame = (difficulty = memoryDifficulty) => {
    // Difficulty determines number of pairs
    const pairCounts = {
      easy: 6,    // 12 cards (4x3 grid)
      medium: 10,  // 20 cards (5x4 grid)
      hard: 15     // 30 cards (6x5 grid)
    }
    const pairCount = pairCounts[difficulty]
    const emojis = visualObjects.slice(0, pairCount)

    // Create pairs
    const pairs = [...emojis, ...emojis].map((emoji, index) => ({
      id: index,
      emoji,
      flipped: false,
      matched: false
    }))

    // Shuffle using Fisher-Yates algorithm
    const shuffled = [...pairs]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }

    setMemoryCards(shuffled)
    setFlippedCards([])
    setMatchedCards([])
    setMemoryMoves(0)
    setMemoryTimer(0)
    setMemoryTimerActive(true)
    setMessage('Find all the matching pairs!')
  }

  // Memory game timer
  useEffect(() => {
    let interval
    if (memoryTimerActive && gameMode === 'memory') {
      interval = setInterval(() => {
        setMemoryTimer(prev => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [memoryTimerActive, gameMode])

  useEffect(() => {
    console.log('Loading initial Pokemon, chain:', currentChain.name, 'stage:', pokemonStage, 'ID:', currentChain.stages[pokemonStage])
    generateQuestion()
    fetchPokemon(currentChain.stages[pokemonStage])
  }, [])

  // Regenerate question when mode changes
  useEffect(() => {
    if (pokemonData) {
      generateQuestion()
    }
  }, [gameMode])

  const handleCorrectAnswer = () => {
    // Memory game gives less HP since matches are harder to get
    const hpGain = gameMode === 'memory' ? 10 : 15
    const newHealth = Math.min(maxHP, health + hpGain)
    console.log(`HP Change: ${health} → ${newHealth} (+${hpGain})`)
    setHealth(newHealth)

    // Check if we should evolve or switch chains
    if (newHealth === maxHP) {
      // Capture the current Pokemon before evolution/switching
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
        // Get available chains (ones with at least one uncaptured Pokemon)
        const availableChains = getAvailableChains(newCaptured)

        console.log('Chain switching - Available chains:', availableChains.map(c => c.name))
        console.log('Total captured Pokemon:', newCaptured.length)

        if (availableChains.length === 0) {
          // All Pokemon captured! Congratulations message
          console.log('🎉 ALL POKEMON CAPTURED! Game complete!')
          // Could add end game logic here or reset to allow replay
          // For now, just cycle through all chains again
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
          // Select from available chains only
          // Filter out current chain if possible
          let eligibleChains = availableChains.filter((chain) => {
            return evolutionChains.findIndex(c => c.name === chain.name) !== currentChainIndex
          })

          // If all available chains are the current chain, use any available
          if (eligibleChains.length === 0) {
            eligibleChains = availableChains
          }

          const selectedChain = eligibleChains[Math.floor(Math.random() * eligibleChains.length)]
          const newChainIndex = evolutionChains.findIndex(c => c.name === selectedChain.name)

          console.log('✓ Switching to chain:', selectedChain.name, 'Index:', newChainIndex)

          setCurrentChainIndex(newChainIndex)
          setPokemonStage(0)
          setLevel(level + 1) // Keep leveling up instead of resetting to 1
          setHealth(0)
          setMaxHP(50)
          setShowSwap(true) // Use swap animation instead of evolution

          setTimeout(() => {
            fetchPokemon(evolutionChains[newChainIndex].stages[0])
            setTimeout(() => {
              setShowSwap(false)
            }, 3000)
          }, 500)
        }
      } else {
        // Normal evolution within current chain
        const newStage = pokemonStage + 1
        const newLevel = level + 1
        setPokemonStage(newStage)
        setLevel(newLevel)
        setHealth(0) // Reset health to 0 after evolution

        // Exponentially increase maxHP: 50, 100, 200, 400...
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
    // Memory game loses less HP since misses are frequent/normal
    const hpLoss = gameMode === 'memory' ? 5 : 20
    const newHealth = Math.max(0, health - hpLoss)
    console.log(`HP Change: ${health} → ${newHealth} (-${hpLoss})`)
    setHealth(newHealth)

    // Devolve when health reaches 0 and not at first stage
    if (newHealth === 0 && pokemonStage > 0) {
      const newStage = pokemonStage - 1
      const newLevel = Math.max(1, level - 1)
      setPokemonStage(newStage)
      setLevel(newLevel)

      // Exponentially decrease maxHP back to previous stage
      const newMaxHP = Math.floor(50 * Math.pow(2, newStage))
      setMaxHP(newMaxHP)

      setHealth(0) // Reset health to 0 after devolution
      setShowDevolution(true)

      setTimeout(() => {
        fetchPokemon(currentChain.stages[newStage])
        setTimeout(() => {
          setShowDevolution(false)
        }, 3000)
      }, 500)
    }
  }

  const checkAnswer = () => {
    // Prevent multiple submissions
    if (isProcessingAnswer) {
      console.log('⚠ Answer already being processed, ignoring duplicate click')
      return
    }

    let isCorrect = false
    let correctAnswer
    let points

    // SCORING SYSTEM:
    // - Spelling Mode: 2 points (easy/3 letters), 3 points (medium/4-5 letters), 5 points (hard/6+ letters)
    // - Math Mode: 1 point (easy/addition), 2 points (medium/subtraction), 3 points (hard/multiplication/division)
    // Note: Spelling intentionally awards slightly more points to encourage literacy practice

    if (gameMode === 'spelling') {
      // Spelling mode - check if word is spelled correctly
      correctAnswer = currentWord.word.toLowerCase()
      const userAnswer = answer.toLowerCase().trim()

      console.log('Check Spelling:', {
        userInput: answer,
        userAnswer,
        correctAnswer,
        isCorrect: userAnswer === correctAnswer
      })

      isCorrect = userAnswer === correctAnswer
      points = isCorrect ? getSpellingPoints(currentWord.word) : 0
    } else {
      // Math mode - check if calculation is correct
      switch (operation) {
        case '+': correctAnswer = num1 + num2; break
        case '-': correctAnswer = num1 - num2; break
        case '×': correctAnswer = num1 * num2; break
        case '÷': correctAnswer = num1 / num2; break
        default: correctAnswer = 0
      }

      const userAnswer = parseInt(answer)

      console.log('Check Answer:', {
        userInput: answer,
        userAnswer,
        correctAnswer,
        isCorrect: userAnswer === correctAnswer,
        isNaN: isNaN(userAnswer)
      })

      isCorrect = !isNaN(userAnswer) && userAnswer === correctAnswer
      points = isCorrect ? getScoreForDifficulty(currentQuestionDifficulty) : 0
    }

    // Handle correct/incorrect answers
    if (isCorrect) {
      setIsProcessingAnswer(true)
      console.log('✓ CORRECT ANSWER - Increasing HP')
      const randomMessage = encouragementMessages[Math.floor(Math.random() * encouragementMessages.length)]
      setMessage(`${randomMessage} +${points} pts!`)
      setScore(score + points)
      handleCorrectAnswer()
      setShowCelebration(true)

      setTimeout(() => {
        setShowCelebration(false)
        generateQuestion()
        setIsProcessingAnswer(false)
      }, 1500)
    } else {
      setIsProcessingAnswer(true)
      console.log('⨯ WRONG ANSWER - Decreasing HP')
      if (gameMode === 'spelling') {
        setMessage(`Oops! It's spelled: ${correctAnswer}`)
      } else {
        setMessage('Oops! Wrong answer!')
      }
      handleWrongAnswer()
      setAnswer('')
      // Reset processing flag immediately for wrong answers
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

  const handleCardClick = (cardIndex) => {
    // Prevent clicking if processing or card already flipped/matched
    if (
      isProcessingAnswer ||
      flippedCards.length >= 2 ||
      flippedCards.includes(cardIndex) ||
      matchedCards.includes(cardIndex)
    ) {
      return
    }

    const newFlippedCards = [...flippedCards, cardIndex]
    setFlippedCards(newFlippedCards)

    if (newFlippedCards.length === 2) {
      setIsProcessingAnswer(true)
      setMemoryMoves(memoryMoves + 1)

      const [firstIndex, secondIndex] = newFlippedCards
      const firstCard = memoryCards[firstIndex]
      const secondCard = memoryCards[secondIndex]

      if (firstCard.emoji === secondCard.emoji) {
        // Match found!
        setTimeout(() => {
          const newMatchedCards = [...matchedCards, firstIndex, secondIndex]
          setMatchedCards(newMatchedCards)
          setFlippedCards([])
          setIsProcessingAnswer(false)

          // Award points
          const points = 3
          setScore(score + points)
          setMessage(`Great match! +${points} pts!`)
          handleCorrectAnswer()
          setShowCelebration(true)

          setTimeout(() => {
            setShowCelebration(false)
            // Check if all pairs found
            if (newMatchedCards.length === memoryCards.length) {
              setMemoryTimerActive(false)

              // Check and save best time
              const currentTime = memoryTimer
              const currentBestTime = bestTimes[memoryDifficulty]

              if (!currentBestTime || currentTime < currentBestTime) {
                const newBestTimes = { ...bestTimes, [memoryDifficulty]: currentTime }
                setBestTimes(newBestTimes)
                localStorage.setItem('memoryBestTimes', JSON.stringify(newBestTimes))
                setMessage(`🎉 New best time! ${currentTime}s! Starting new game...`)
              } else {
                setMessage(`All pairs found in ${currentTime}s! Starting new game...`)
              }

              setTimeout(() => {
                generateMemoryGame()
              }, 2000)
            } else {
              setMessage('Find the next pair!')
            }
          }, 1000)
        }, 500)
      } else {
        // No match - add shake animation
        setWrongMatchCards(newFlippedCards)
        setTimeout(() => {
          setFlippedCards([])
          setWrongMatchCards([])
          setIsProcessingAnswer(false)
          setMessage('Try again!')
          handleWrongAnswer()
        }, 1000)
      }
    }
  }

  return (
    <div className="game-container">
      {showModeSelection ? (
        <div className="mode-selection-screen">
          <h1 className="selection-title">Choose Your Adventure!</h1>
          <div className="mode-cards">
            <div className="mode-card" onClick={() => handleModeSelection('math')}>
              <div className="mode-card-icon">123</div>
              <h2 className="mode-card-title">Math Adventure</h2>
              <p className="mode-card-description">Practice addition, subtraction, multiplication, and division with visual aids!</p>
            </div>
            <div className="mode-card" onClick={() => handleModeSelection('spelling')}>
              <div className="mode-card-icon">ABC</div>
              <h2 className="mode-card-title">Spelling Adventure</h2>
              <p className="mode-card-description">Learn to spell words with audio hints and visual clues!</p>
            </div>
            <div className="mode-card" onClick={() => handleModeSelection('memory')}>
              <div className="mode-card-icon">🧠</div>
              <h2 className="mode-card-title">Memory Game</h2>
              <p className="mode-card-description">Find matching pairs and train your memory skills!</p>
            </div>
          </div>
        </div>
      ) : (
      <div className="game-layout">
        {/* Left Panel - Pokemon */}
        <div className="pokemon-panel">
          <div className="panel-header">
            <h2 className="panel-title">Your Pokemon</h2>
            <div className="level-badge">Lv {level}</div>
          </div>

          {pokemonData && (
            <>
              <div className="pokemon-display-card">
                <img
                  src={pokemonData.sprites.front_default}
                  alt={pokemonData.name}
                  className="pokemon-sprite-main"
                  style={{
                    filter: (health / maxHP) * 100 < 33 ? 'brightness(0.7) saturate(0.8)' : 'none',
                    animation: (health / maxHP) * 100 < 33 ? 'shake 0.5s infinite' : 'bounce-gentle 2s ease-in-out infinite'
                  }}
                />
                <div className="pokemon-name-main">{pokemonData.name}</div>
              </div>

              <div className="health-section">
                <div className="health-label-row">
                  <span className="health-label">HP</span>
                  <span className="health-text">{health}/{maxHP}</span>
                </div>
                <div className="health-bar-background">
                  <div
                    className="health-bar-fill"
                    style={{
                      width: `${(health / maxHP) * 100}%`,
                      backgroundColor: getHealthColor()
                    }}
                  ></div>
                </div>
              </div>

              <div className="score-display">
                <div className="score-label">Score</div>
                <div className="score-value">{score}</div>
              </div>
            </>
          )}

          {capturedPokemon.length > 0 && (
            <div className="captured-section">
              <div className="captured-header">Captured Pokemon ({capturedPokemon.length})</div>
              <div className="captured-list">
                {capturedPokemon.map((pokemon, index) => (
                  <div
                    key={`${pokemon.id}-${index}`}
                    className="captured-pokemon"
                    onClick={() => setSelectedPokemon(pokemon)}
                  >
                    <img
                      src={pokemon.sprite}
                      alt={pokemon.name}
                      className="captured-sprite"
                    />
                    <div className="captured-pokemon-name">{pokemon.name}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Panel - Game */}
        <div className="game-panel">
          <div className="game-header">
            <h1 className="game-title">
              {gameMode === 'spelling' ? 'Spelling Adventure' : gameMode === 'memory' ? 'Memory Game' : 'Math Adventure'}
            </h1>
            <div className="mode-actions">
              <button
                className="back-button"
                onClick={() => setShowModeSelection(true)}
                disabled={isProcessingAnswer}
              >
                ← Change Mode
              </button>
            </div>
          </div>

          <div className="game-content-inner">
            <div className={`message ${showCelebration ? 'celebration' : ''}`}>
              {message}
            </div>

        <div className="problem-container">
          {gameMode === 'memory' ? (
            <div className="memory-game">
              <div className="memory-controls">
                <div className="difficulty-selector">
                  <button
                    className={`difficulty-btn ${memoryDifficulty === 'easy' ? 'active' : ''}`}
                    onClick={() => {
                      setMemoryDifficulty('easy')
                      generateMemoryGame('easy')
                    }}
                    disabled={isProcessingAnswer}
                  >
                    Easy (6 pairs)
                  </button>
                  <button
                    className={`difficulty-btn ${memoryDifficulty === 'medium' ? 'active' : ''}`}
                    onClick={() => {
                      setMemoryDifficulty('medium')
                      generateMemoryGame('medium')
                    }}
                    disabled={isProcessingAnswer}
                  >
                    Medium (10 pairs)
                  </button>
                  <button
                    className={`difficulty-btn ${memoryDifficulty === 'hard' ? 'active' : ''}`}
                    onClick={() => {
                      setMemoryDifficulty('hard')
                      generateMemoryGame('hard')
                    }}
                    disabled={isProcessingAnswer}
                  >
                    Hard (15 pairs)
                  </button>
                </div>
              </div>

              <div className="memory-stats">
                <div className="memory-stat">
                  ⏱️ Time: {Math.floor(memoryTimer / 60)}:{(memoryTimer % 60).toString().padStart(2, '0')}
                </div>
                <div className="memory-stat">🎯 Moves: {memoryMoves}</div>
                <div className="memory-stat">
                  ✨ Pairs: {matchedCards.length / 2} / {memoryCards.length / 2}
                </div>
                {bestTimes[memoryDifficulty] && (
                  <div className="memory-stat best-time">
                    🏆 Best: {Math.floor(bestTimes[memoryDifficulty] / 60)}:{(bestTimes[memoryDifficulty] % 60).toString().padStart(2, '0')}
                  </div>
                )}
              </div>

              <div className={`memory-grid difficulty-${memoryDifficulty}`}>
                {memoryCards.map((card, index) => (
                  <div
                    key={index}
                    className={`memory-card ${
                      flippedCards.includes(index) || matchedCards.includes(index) ? 'flipped' : ''
                    } ${matchedCards.includes(index) ? 'matched' : ''} ${
                      wrongMatchCards.includes(index) ? 'wrong-match' : ''
                    }`}
                    style={{ '--index': index }}
                    onClick={() => handleCardClick(index)}
                  >
                    <div className="memory-card-inner">
                      <div className="memory-card-front">?</div>
                      <div className="memory-card-back">{card.emoji}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : gameMode === 'spelling' && currentWord ? (
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
          ) : gameMode === 'math' ? (
            <>
          {operation === '+' ? (
            <div className="visual-problem">
              <div className="visual-group">
                <span className="number">{num1}</span>
                <VisualCounter count={num1} />
              </div>

              <span className="operator">{operation}</span>

              <div className="visual-group">
                <span className="number">{num2}</span>
                <VisualCounter count={num2} />
              </div>

              <span className="equals">=</span>
              <span className="question">?</span>
            </div>
          ) : operation === '-' ? (
            <div className="visual-problem subtraction">
              <div className="operation-explanation">
                Start with <strong>{num1}</strong> {currentEmoji}, then take away <strong>{num2}</strong> {currentEmoji}
              </div>
              <div className="visual-group-full">
                <div className="visual-counter-subtraction">
                  {[...Array(num1)].map((_, i) => (
                    <span
                      key={i}
                      className={`visual-object ${i >= num1 - num2 ? 'crossed-out' : ''}`}
                      style={{ animationDelay: `${i * 0.1}s` }}
                    >
                      {currentEmoji}
                    </span>
                  ))}
                </div>
                <div className="operation-math">
                  <span className="number">{num1}</span>
                  <span className="operator">{operation}</span>
                  <span className="number">{num2}</span>
                  <span className="equals">=</span>
                  <span className="question">?</span>
                </div>
              </div>
            </div>
          ) : operation === '×' ? (
            <div className="visual-problem multiplication">
              <div className="operation-explanation">
                <strong>{num1}</strong> rows × <strong>{num2}</strong> columns = <strong>{num1 * num2}</strong> {currentEmoji}
              </div>
              <div className="visual-group-full">
                <div className="multiplication-array">
                  {[...Array(num1)].map((_, rowIdx) => (
                    <div key={rowIdx} className="multiplication-row" style={{ animationDelay: `${rowIdx * 0.1}s` }}>
                      {[...Array(num2)].map((_, colIdx) => (
                        <span
                          key={colIdx}
                          className="visual-object-mult"
                          style={{ animationDelay: `${(rowIdx * 0.1) + (colIdx * 0.05)}s` }}
                        >
                          {currentEmoji}
                        </span>
                      ))}
                    </div>
                  ))}
                </div>
                <div className="operation-math">
                  <span className="number">{num1}</span>
                  <span className="operator">{operation}</span>
                  <span className="number">{num2}</span>
                  <span className="equals">=</span>
                  <span className="question">?</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="visual-problem division">
              <div className="operation-explanation">
                Divide <strong>{num1}</strong> {currentEmoji} into <strong>{num2}</strong> equal groups
              </div>
              <div className="visual-group-full">
                <div className="division-container">
                  {[...Array(num2)].map((_, groupIdx) => (
                    <div key={groupIdx} className="division-circle" style={{ animationDelay: `${groupIdx * 0.15}s` }}>
                      <div className="circle-label">{groupIdx + 1}</div>
                      <div className="circle-items">
                        {[...Array(num1 / num2)].map((_, itemIdx) => (
                          <span
                            key={itemIdx}
                            className="visual-object-div"
                            style={{ animationDelay: `${(groupIdx * 0.15) + (itemIdx * 0.1)}s` }}
                          >
                            {currentEmoji}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="operation-math">
                  <span className="number">{num1}</span>
                  <span className="operator">{operation}</span>
                  <span className="number">{num2}</span>
                  <span className="equals">=</span>
                  <span className="question">?</span>
                </div>
              </div>
            </div>
          )}
            </>
          ) : null}
        </div>

        {gameMode !== 'memory' && (
          <>
            <div className="answer-section">
              <input
                type={gameMode === 'spelling' ? 'text' : 'number'}
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

            <button className="skip-button" onClick={generateQuestion} title="Skip to next question">
              <MdSkipNext />
            </button>
          </>
        )}

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
        </div>
      </div>
      )}

      {showEvolution && pokemonData && (
        <div className="evolution-overlay">
          <div className="evolution-content">
            <h2 className="evolution-title">Evolution!</h2>
            <img
              src={pokemonData.sprites.front_default}
              alt={pokemonData.name}
              className="evolution-sprite"
            />
            <div className="evolution-text">
              {pokemonData.name} is evolving!
            </div>
          </div>
        </div>
      )}

      {showDevolution && pokemonData && (
        <div className="devolution-overlay">
          <div className="devolution-content">
            <h2 className="devolution-title">Oh no!</h2>
            <img
              src={pokemonData.sprites.front_default}
              alt={pokemonData.name}
              className="devolution-sprite"
            />
            <div className="devolution-text">
              {pokemonData.name} devolved...
            </div>
          </div>
        </div>
      )}

      {showSwap && pokemonData && (
        <div className="swap-overlay">
          <div className="swap-content">
            <h2 className="swap-title">New Adventure!</h2>
            <img
              src={pokemonData.sprites.front_default}
              alt={pokemonData.name}
              className="swap-sprite"
            />
            <div className="swap-text">
              A new Pokemon joins you!
            </div>
          </div>
        </div>
      )}

      {selectedPokemon && (
        <div className="pokemon-detail-overlay" onClick={() => setSelectedPokemon(null)}>
          <div className="pokemon-detail-modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal" onClick={() => setSelectedPokemon(null)}>×</button>
            <div className="pokemon-detail-content">
              <h2 className="pokemon-detail-name">{selectedPokemon.name}</h2>
              <div className="pokemon-detail-id">#{selectedPokemon.id}</div>
              <img
                src={selectedPokemon.sprite}
                alt={selectedPokemon.name}
                className="pokemon-detail-sprite"
              />
              <div className="pokemon-detail-captured">
                Captured on: {new Date(selectedPokemon.capturedAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
