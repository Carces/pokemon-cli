const inquirer = require('inquirer');
const fs = require('fs/promises');
const create = require('./main-game/data/create');
const {
  randomTrainer,
  randomWildPokemon,
} = require('./main-game/trainers/random-trainer');
const { Battle } = require('./main-game/scenes/battle');
const { loadGame } = require('./main-game/load-game');
const { itemsData } = require('./main-game/data/items-data');
const beginGame = require('./main-game/scenes/begin-game');
const { enterTown } = require('./main-game/scenes/town');
const { delay, delayInit, createDelay } = require('./utils/delay');
delayInit();

let currentPlayerData;
let currentRivalData;
let currentPlayer;
let currentRival;

function mainMenu() {
  console.log(`
██████╗░░█████╗░██╗░░██╗███████╗███╗░░░███╗░█████╗░███╗░░██╗
██╔══██╗██╔══██╗██║░██╔╝██╔════╝████╗░████║██╔══██╗████╗░██║
██████╔╝██║░░██║█████═╝░█████╗░░██╔████╔██║██║░░██║██╔██╗██║
██╔═══╝░██║░░██║██╔═██╗░██╔══╝░░██║╚██╔╝██║██║░░██║██║╚████║
██║░░░░░╚█████╔╝██║░╚██╗███████╗██║░╚═╝░██║╚█████╔╝██║░╚███║
╚═╝░░░░░░╚════╝░╚═╝░░╚═╝╚══════╝╚═╝░░░░░╚═╝░╚════╝░╚═╝░░╚══╝

                   ░█████╗░██╗░░░░░██╗
                   ██╔══██╗██║░░░░░██║
                   ██║░░╚═╝██║░░░░░██║
                   ██║░░██╗██║░░░░░██║
                   ╚█████╔╝███████╗██║
                   ░╚════╝░╚══════╝╚═╝
\\==========================================================/`);
  const newGameText = `
            █▄░█ █▀▀ █░█░█   █▀▀ ▄▀█ █▀▄▀█ █▀▀
            █░▀█ ██▄ ▀▄▀▄▀   █▄█ █▀█ █░▀░█ ██▄`;
  const loadGameText = `
            █░░ █▀█ ▄▀█ █▀▄  █▀▀ ▄▀█ █▀▄▀█ █▀▀
            █▄▄ █▄█ █▀█ █▄▀  █▄█ █▀█ █░▀░█ ██▄\n`;
  return inquirer
    .prompt([
      {
        type: 'list',
        name: 'mainMenu',
        message: ` `,
        choices: [newGameText, loadGameText],
      },
    ])
    .then((answers) => {
      if (answers.mainMenu === newGameText) {
        return createDelay(100).then(() => beginGame());
      } else return Promise.resolve();
    });
}

mainMenu()
  .then(() => {
    return loadGame();
  })
  .then(({ playerData, rivalData }) => {
    currentPlayerData = playerData;
    currentRivalData = rivalData;
    currentPlayer = currentPlayerData.player;
    currentRival = currentRivalData.rival;
    return createDelay(100);
  })
  .then(() => {
    const { player } = currentPlayerData;
    const level = player.currentPokeball.storage.level;
    const opponent = randomWildPokemon(level, null, 'Rattata');
    const { trainerData, battleTrainer } = opponent;
    const randomBattle = new Battle(player, battleTrainer);
    return randomBattle.startBattle();
  })
  .then(() => enterTown(currentPlayerData, currentRivalData))
  .then(([saveSuccessful, playerData, rivalData]) => {
    if (!saveSuccessful)
      console.log('\n //// ERROR! Save unsuccessful //// \n');
    currentPlayerData = playerData;
    currentRivalData = rivalData;

    const { player } = currentPlayerData;
    const level = player.currentPokeball.storage.level;
    const opponent = randomTrainer(level, null);
    const { trainerData, battleTrainer } = opponent;
    const randomBattle = new Battle(player, battleTrainer);
    console.log('\nYou see a trainer approaching!\n');
    console.log(`\n[${trainerData.name}]: ${trainerData.messages[0]}\n`);
    return createDelay(2000).then(() =>
      Promise.all([randomBattle.startBattle(), opponent])
    );
  })
  .then(({ battlePromise, opponent }) => {
    // const { trainerData, battleTrainer } = opponent;
    // console.log(`\n- ${trainerData.name}: ${trainerData.defeatMessages[0]}\n`);
    console.log('BATTLE OVER');
    console.log('BATTLE OVER');
    console.log('BATTLE OVER');
    console.log('BATTLE OVER');
    console.log('BATTLE OVER');
    console.log('BATTLE OVER');
  });
