const inquirer = require('inquirer');
const fs = require('fs/promises');
const create = require('./data/create');
const { randomTrainer } = require('./trainers/random-trainer');
const { Battle } = require('./scenes/battle');
const { loadGame } = require('./load-game');
const { itemsData } = require('./data/items-data');
const beginGame = require('./scenes/begin-game');
const { enterTown } = require('./scenes/town');

let currentPlayerData;
let currentRivalData;
let currentPlayer;
let currentRival;

function mainMenu() {
  console.log(
    `
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
\\==========================================================/`
  );
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
        return beginGame();
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
  })
  .then(() => {
    return enterTown(currentPlayerData, currentRivalData);
  })
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
    return Promise.all([randomBattle.doBattle(), opponent]);
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
