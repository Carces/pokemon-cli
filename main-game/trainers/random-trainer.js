const trainersData = require('../data/trainers-data');
const speciesData = require('../data/species-data');
const { Trainer } = require('./trainer');
const { WildPokemon } = require('./wild-pokemon');
const create = require('../data/create');

function getRandom(arr) {
  const randomIndex = Math.round(Math.random() * (arr.length - 1));
  const index = Math.max(randomIndex, 0);
  return arr[index];
}

function getWeightedRandomSpecies(targetRarity = 1, speciesToExclude) {
  const speciesWithRarity = Object.entries(speciesData)
    .filter(
      ([speciesName]) =>
        !speciesToExclude || !speciesToExclude.includes(speciesName)
    )
    .map(([species, { rarity }]) => ({ species, rarity }));
  const totalRarity = speciesWithRarity.reduce(
    (acc, curr) => acc + curr.rarity,
    0
  );

  const weightedSpecies = {};
  speciesWithRarity.forEach((item) => {
    const difference = Math.abs(item.rarity - targetRarity);
    const weight = Math.pow(0.4, difference + difference / 4);
    const value = Math.round(weight * totalRarity) || 1;
    weightedSpecies[item.species] = value;
    // console.log(targetRarity);
    // console.log(item.species, item.rarity, '||', difference, weight, value);
  });

  const table = Object.entries(weightedSpecies).flatMap(([species, weight]) =>
    Array(weight).fill(species)
  );
  return table[Math.floor(Math.random() * table.length)];
}

function randomPokemon(
  level = 1,
  targetRarity,
  typePreferences,
  speciesToExclude
) {
  const speciesKeys = targetRarity
    ? null
    : !speciesToExclude
    ? Object.keys(speciesData)
    : Object.keys(speciesData).filter(
        (speciesName) => !speciesToExclude.includes(speciesName)
      );
  const randomSpecies = targetRarity
    ? getWeightedRandomSpecies(targetRarity, speciesToExclude)
    : getRandom(speciesKeys);
  // const randomMoves = ['Tackle']; // GEENERATE RANDOMLY AND USE TO REPLACE THE HIGHEST LEVEL MOVES GRANTING IN SPECIES CONSTRUCTORS
  if (!randomSpecies) {
    console.log(
      'WARNING: randomPokemon() - no valid pokemon found for specified targetRarity and speciesToExclude'
    );
    return null;
  }
  return create.pokemon(randomSpecies, randomSpecies, level);
}

function fillPokemonArr(
  pokemonArr,
  level,
  pokemonCount,
  targetRarity,
  typePreferences,
  speciesToExclude
) {
  while (pokemonArr.length < pokemonCount) {
    const randomLevel = Math.max(1, level + Math.round(Math.random() * 3) - 2);
    pokemonArr.push(
      randomPokemon(
        randomLevel,
        targetRarity,
        typePreferences,
        speciesToExclude
      )
    );
  }

  return pokemonArr;
}

function randomTrainer(
  level,
  typePreferences,
  useNPCs,
  NPCName,
  pokemonCount,
  speciesToExclude
) {
  const { NPCs, names, messages, defeatMessages } = trainersData;
  const NPCList = Object.values(NPCs);
  const randomNPC = getRandom(NPCList);
  const pokemonArr = [];
  const targetRarity = Math.max(1, Math.round(level / 2));
  const trainer =
    useNPCs && NPCName
      ? NPCs[NPCName]
      : useNPCs
      ? randomNPC
      : {
          name: '',
          messages: [],
          defeatMessages: [],
          pokemon: [],
          typePreferences: [],
          typeExclusive: false,
          rewards: [],
        };

  if (!useNPCs) {
    trainer.name = getRandom(names);
    trainer.messages = [getRandom(messages)];
    trainer.defeatMessages = [getRandom(defeatMessages)];
    if (!pokemonCount) {
      const minPokeCount = Math.floor(level / 10) + 1;
      const maxPokeCount = Math.round(Math.random() * (level / 2));
      const pokeCount = Math.max(minPokeCount, maxPokeCount);
      pokemonCount = Math.min(pokeCount, 6);
    }
    fillPokemonArr(
      pokemonArr,
      level,
      pokemonCount,
      targetRarity,
      typePreferences,
      speciesToExclude
    );
  } else {
    trainer.messages = [getRandom(trainer.messages)];
    trainer.defeatMessages = [getRandom(trainer.defeatMessages)];
    trainer.pokemon.forEach((pokeName) => {
      const randomLevel = Math.max(
        1,
        level + Math.round(Math.random() * 3) - 2
      );
      pokemonArr.push(create.pokemon(pokeName, pokeName, randomLevel));
    });
  }

  return {
    trainerData: trainer,
    battleTrainer: new Trainer(trainer.name, pokemonArr),
  };
}

function randomWildPokemon(level, pokemonName, typePreferences) {
  const pokemonArr = [];
  const targetRarity = Math.max(1, Math.round(level / 2));

  if (!pokemonName) {
    fillPokemonArr(pokemonArr, level, 1, targetRarity, typePreferences);
  } else pokemonArr.push(create.pokemon(pokemonName, pokemonName, level));

  const wildPokemonName = `Wild ${pokemonArr[0].name}`;

  return {
    trainerData: { name: wildPokemonName, isWild: true },
    battleTrainer: new WildPokemon(wildPokemonName, pokemonArr),
  };
}

module.exports = { randomTrainer, randomWildPokemon };
