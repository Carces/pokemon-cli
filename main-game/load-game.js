const inquirer = require('inquirer');
const fs = require('fs/promises');
const path = require('path');
const { Trainer } = require('./trainers/trainer.js');
const { Player } = require('./trainers/player.js');
const speciesData = require('./data/species-data.js');
const ballsData = require('./data/balls-data.js');
const { townsData } = require('./data/towns-data');
const PlayerData = require('./data/player-data.js');
const RivalData = require('./data/rival-data.js');
const create = require('./data/create.js');

function loadGame() {
  console.log('Loading...');
  return fs
    .readFile(path.join(__dirname, 'data', 'save-data.json'), 'utf-8')
    .then((saveFile) => {
      const saveData = JSON.parse(saveFile);
      const playerData = saveData.playerData;
      const rivalData = saveData.rivalData;
      const player = playerData.player;
      const rival = rivalData.rival;

      const newPlayerInstance = new Player();
      const newRivalInstance = new Trainer();

      function loadTrainerInstance(trainer) {
        const newTrainerInstance =
          trainer === player ? newPlayerInstance : newRivalInstance;
        ({
          name: newTrainerInstance.name,
          pokemonList: newTrainerInstance.pokemonList,
          isPlayer: newTrainerInstance.isPlayer,
          inventory: newTrainerInstance.inventory,
        } = trainer);

        trainer.belt.forEach((ball, i) => {
          const pokemon = ball.storage;
          const ballTypeName = ball.ballType.name;
          const newBallInstance = new ballsData[ballTypeName + 'Ball']();
          const speciesName = ball.storage.species;
          const newPokemonInstance = create.pokemon(
            speciesName,
            pokemon.name,
            pokemon.level
          );

          ({
            types: newPokemonInstance.types,
            moves: newPokemonInstance.moves,
            hitPoints: newPokemonInstance.hitPoints,
            attack: newPokemonInstance.attack,
            defence: newPokemonInstance.defence,
            speed: newPokemonInstance.speed,
            accuracy: newPokemonInstance.accuracy,
            catchDifficulty: newPokemonInstance.catchDifficulty,
            xpThreshold: newPokemonInstance.xpThreshold,
            xp: newPokemonInstance.xp,
            activeEffects: newPokemonInstance.activeEffects,
          } = pokemon);

          newBallInstance.storage = newPokemonInstance;
          if (trainer === player) newPlayerInstance.belt.push(newBallInstance);
          else newRivalInstance.belt.push(newBallInstance);
        });

        const currentPokeballIndex = newTrainerInstance.belt.findIndex(
          (ball) => {
            return ball.storage.name === trainer.currentPokeball.storage.name;
          }
        );

        newTrainerInstance.currentPokeball =
          newTrainerInstance.belt[currentPokeballIndex];
      }

      loadTrainerInstance(player);
      loadTrainerInstance(rival);
      playerData.player = newPlayerInstance;
      rivalData.rival = newRivalInstance;
      console.log('Loaded!\n\n');
      return { playerData, rivalData };
    });
}

module.exports = { loadGame };
