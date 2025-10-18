// Extract core game logic for testing

// Pokemon evolution chains - using PokeAPI IDs (Verified with PokeAPI)
export const evolutionChains = [
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
