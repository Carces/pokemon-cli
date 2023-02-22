const trainersData = require('../data/trainers-data');
const speciesData = require('../data/species-data');
const { Trainer } = require('./trainer');
const { WildPokemon } = require('./wild-pokemon');
const create = require('../data/create');

function getRandom(arr) {
  const randomIndex = Math.round(Math.random() * arr.length - 1);
  const index = Math.max(randomIndex, 0);
  return arr[index];
}

function randomPokemon(level, typePreferences) {
  const speciesKeys = Object.keys(speciesData).filter(
    (key) => key !== 'newPokemon'
  );
  const randomSpecies = getRandom(speciesKeys, 0);
  const randomMoves = ['Tackle']; // GEENERATE RANDOMLY AND USE TO REPLACE THE HIGHEST LEVEL MOVES GRANTING IN SPECIES CONSTRUCTORS
  return new speciesData[randomSpecies](randomSpecies, level);
}

function fillPokemonArr(pokemonArr, level, typePreferences, pokemonCount) {
  const rand = Math.round(Math.random() * 5) + 1;
  const rand2 = Math.round(Math.random() * 5) + 1;

  const randomPokemonCount = pokemonCount || Math.min(rand, rand2);
  while (pokemonArr.length < randomPokemonCount) {
    const randomLevel = Math.max(1, level + Math.round(Math.random() * 3) - 2);
    pokemonArr.push(randomPokemon(randomLevel, typePreferences));
  }

  return pokemonArr;
}

function randomTrainer({
  level,
  typePreferences,
  useNPCs,
  NPCName,
  pokemonCount,
}) {
  const { NPCs, names, messages, defeatMessages } = trainersData;
  const NPCList = Object.values(NPCs);
  const randomNPC = getRandom(NPCList);
  const pokemonArr = [];
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

  fillPokemonArr(pokemonArr, level, typePreferences, pokemonCount);

  return {
    trainerData: trainer,
    battleTrainer: new Trainer(trainer.name, pokemonArr),
  };
}

function randomWildPokemon({ level, typePreferences }) {
  const pokemonArr = [];

  fillPokemonArr(pokemonArr, level, typePreferences, 1);
  const wildPokemonName = `Wild ${pokemonArr[0].name}`;

  return {
    trainerData: { name: wildPokemonName, isWild: true },
    battleTrainer: new WildPokemon(wildPokemonName, pokemonArr),
  };
}

module.exports = { randomTrainer, randomWildPokemon };
