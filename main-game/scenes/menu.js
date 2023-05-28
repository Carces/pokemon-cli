const inquirer = require('inquirer');
const fs = require('fs/promises');
const create = require('../data/create');
const loadGame = require('../load-game.js');
const { saveGame } = require('../save-game');
const { itemsData } = require('../data/items-data.js');
const { townsData } = require('../data/towns-data');
const { Player } = require('../trainers/player');
const { movesData } = require('../data/moves-data');

let currentPlayerData;
let currentRivalData;
let currentMenu;

function mainMenu(playerData, rivalData) {
  if (playerData) currentPlayerData = playerData;
  if (rivalData) currentRivalData = rivalData;

  const menuPrompt = {
    type: 'list',
    name: 'menuAction',
    message: `========================================\nChoose an action:`,
    choices: ['Items', 'Pokemon', 'Save', 'Quit', '--EXIT MENU--'],
  };
  return inquirer.prompt([menuPrompt]).then(({ menuAction }) => {
    if (menuAction === 'Items') {
      return itemsMenu();
    } else if (menuAction === 'Pokemon') {
      return pokemonMenu();
    } else if (menuAction === 'Save') {
      return saveGame({ currentPlayerData, currentRivalData }).then(() =>
        mainMenu()
      );
    } else if (menuAction === 'Quit') {
      // auto-save on quit here
      return 'quit';
    } else if (menuAction === '--EXIT MENU--') {
      return [currentPlayerData, currentRivalData];
    }
  });
}

function itemsMenu() {
  const { inventory } = currentPlayerData.player;
  const inventoryEntries = Object.entries(inventory).filter(
    (itemEntry) => itemEntry[0] !== 'Money'
  );
  const itemChoices = inventoryEntries.map((itemEntry) =>
    itemEntry[0].endsWith('Ball')
      ? {
          name: `${itemEntry[0]}: ${itemEntry[1]}`,
          disabled: 'Cannot be used outside of battle.',
        }
      : `${itemEntry[0]}: ${itemEntry[1]}`
  );

  const itemsMenuPrompt = {
    type: 'list',
    name: 'itemChoice',
    message: `========================================\n
Money: ${inventory.Money}₽
Items:`,
    choices: [...itemChoices, '--BACK--'],
  };
  return inquirer.prompt([itemsMenuPrompt]).then(({ itemChoice }) => {
    if (itemChoice === '--BACK--') return mainMenu();
    else {
      const itemToUse = itemChoice.split(':')[0];
      return currentPlayerData.player
        .useItem(
          itemToUse,
          currentPlayerData.player,
          null,
          null,
          currentPlayerData
        )
        .then(() => itemsMenu());
    }
  });
}

function pokemonMenu(pokemonToSwitch) {
  const pokemonChoices = currentPlayerData.player.getPokemonChoices();

  const pokemonMenuPrompt = {
    type: 'list',
    name: 'pokemonChoice',
    message: pokemonToSwitch
      ? `Switch ${pokemonToSwitch.name}'s position with which Pokemon?:`
      : `========================================\n
Pokemon:`,
    choices: [...pokemonChoices, '--BACK--'],
  };
  return inquirer.prompt([pokemonMenuPrompt]).then(({ pokemonChoice }) => {
    const pokeName = pokemonChoice.split(':')[0];

    if (pokemonChoice === '--BACK--' && pokemonToSwitch) return pokemonMenu();
    else if (pokemonChoice === '--BACK--') return mainMenu();
    else if (pokemonToSwitch) {
      const { player } = currentPlayerData;
      const switchPokeIndex = player.pokemonList.indexOf(pokemonToSwitch.name);
      const replacePokeIndex = player.pokemonList.indexOf(pokeName);
      // If one of the switched Pokemon is currentPokeball, change it
      if (replacePokeIndex === 0 || switchPokeIndex === 0) {
        const newCurrentPokeName =
          replacePokeIndex === 0 ? pokemonToSwitch.name : pokeName;
        const newCurrentPokeball = player.belt.find(
          (ball) => ball.storage.name === newCurrentPokeName
        );
        player.currentPokeball = newCurrentPokeball;
      }
      // Switch positions in pokemonList
      player.pokemonList[switchPokeIndex] = pokeName;
      player.pokemonList[replacePokeIndex] = pokemonToSwitch.name;
      return pokemonMenu();
    } else return pokemonActionMenu(pokemonChoice);
  });
}

function pokemonActionMenu(pokemonChoice) {
  const pokeName = pokemonChoice.split(':')[0];
  const pokemon = currentPlayerData.player.getPokemon(pokeName).pokemonObj;

  const pokemonActionMenuPrompt = {
    type: 'list',
    name: 'pokemonAction',
    message: `========================================\n
${pokeName}:`,
    choices: ['Switch', 'Details', 'Use Move', '--BACK--'],
  };
  return inquirer
    .prompt([pokemonActionMenuPrompt])
    .then(({ pokemonAction }) => {
      if (pokemonAction === '--BACK--') return pokemonMenu();
      else if (pokemonAction === 'Switch') return pokemonMenu(pokemon);
      else if (pokemonAction === 'Details') return pokemonDetails(pokemon);
      else if (pokemonAction === 'Use Move') return pokemonMoves(pokemon);
    });
}

function pokemonDetails(pokemon) {
  const pokemonDetailsPrompts = [
    {
      type: 'input',
      name: 'pokemonDetails',
      message: `========================================\n
${pokemon.name}:
Level: ${pokemon.level}
Hit Points: ${pokemon.hitPoints.current}/${pokemon.hitPoints.max}
Experience Points to next level: ${pokemon.xpThreshold - pokemon.xp}
${pokemon.showXpBar()}

Species: ${pokemon.species}
Type: ${
        pokemon.type[0].toUpperCase() +
        pokemon.type.slice(1, pokemon.type.length)
      }
----------------------
Attack: ${pokemon.attack.max}
Defence: ${pokemon.defence.max}
Speed: ${pokemon.speed.max}
----------------------`,
    },
    {
      type: 'input',
      name: 'pokemonArt',
      message: `${pokemon.art}`,
    },
  ];
  return inquirer.prompt(pokemonDetailsPrompts).then(() => pokemonMenu());
}

function pokemonMoves(pokemon) {
  const movesChoices = pokemon.moves.map((move) =>
    movesData[move].effectOutsideBattle
      ? move
      : { name: move, disabled: 'Cannot be used outside of battle.' }
  );

  const pokemonMovesPrompt = {
    type: 'list',
    name: 'pokemonMove',
    message: `========================================\n
${pokemon.name}'s moves:`,
    choices: [...movesChoices, '--BACK--'],
  };
  return inquirer.prompt([pokemonMovesPrompt]).then(({ pokemonMove }) => {
    if (pokemonMove === '--BACK--') return pokemonMenu();
    else {
      pokemon.useMove(movesData[pokemonMove], null, true);
      currentPlayerData.effectOutsideBattle =
        movesData[pokemonMove].effectOutsideBattle;
      return mainMenu();
    }
  });
}

module.exports = { mainMenu };
