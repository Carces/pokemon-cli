const { createDelay } = require('../utils/delay');
const { saveGame } = require('./save-game');
const { loadGame } = require('./load-game');
const { enterTown } = require('./scenes/town');
const { townsData } = require('./data/towns-data');
const {
  randomTrainer,
  randomWildPokemon,
} = require('./trainers/random-trainer');
const { Battle } = require('./scenes/battle');
const { mainMenu } = require('./scenes/menu');
const inquirer = require('inquirer');

let currentLoopNum;
let currentPlayerData;
let currentRivalData;

function gameLoop(
  loopNum,
  initialPlayerData,
  initialRivalData,
  exitGame = false
) {
  function randomUnvisitedTownName() {
    const unvisitedTownNames = Object.keys(townsData).filter(
      (townName) => !currentPlayerData.townsVisited.includes(townName)
    );
    const townsLength = unvisitedTownNames.length;
    const randomUnvisitedTownIndex = Math.round(
      Math.random() * townsLength - 1
    );
    const townIndex = Math.max(randomUnvisitedTownIndex, 0);

    return unvisitedTownNames[townIndex];
  }

  currentLoopNum = loopNum;
  currentPlayerData = initialPlayerData;
  currentRivalData = initialRivalData;
  const { stageToLoad } = currentPlayerData;

  // skip if loading later stage
  if (stageToLoad.startsWith('battle')) return Promise.resolve();

  // reload the same town if town in this loopNum was previously visited
  if (!currentPlayerData.townsVisited[loopNum - 1]) {
    currentPlayerData.townsVisited[loopNum - 1] = randomUnvisitedTownName();
  }

  return (
    saveGame({ playerData: currentPlayerData, rivalData: currentRivalData })
      // [ town<loopNum> ]
      .then(() => {
        // skip block if loading game
        const stageID = `town${loopNum}`;
        const { stageToLoad } = currentPlayerData;
        if (stageToLoad !== stageID) return Promise.resolve();
        /////
        const townFromLoad = currentPlayerData.townsVisited[loopNum - 1];
        return enterTown(currentPlayerData, currentRivalData, townFromLoad);
      })
      // - load game -
      .then((res) => {
        if (res === 'quit') throw new Error('quit');
        return loadGame();
      })
      // - set current data to loaded data -
      .then(({ playerData, rivalData }) => {
        currentPlayerData = playerData;
        currentRivalData = rivalData;
        currentPlayerData.stageToLoad = `trainerBattle${loopNum}`;
        return createDelay(100);
      })
      // battle encounter
      // one then block for each battle.
      // within later then blocks, only do their battle logic if stage < 10, < 5 etc.
      // Probably start with two battles, go to 3 battles starting stage 5. Maybe 5 battles at stage 20?
      // use rng to choose whether each battle is a wild trainer or not, 70/30 in favour of wild(?)
      // ! trainerBattle<loopNum> !
      .then(() => {
        // skip block if loading game
        const stageID = `trainerBattle${loopNum}`;
        const { stageToLoad } = currentPlayerData;
        if (stageToLoad !== stageID) return Promise.resolve();
        /////

        const { player } = currentPlayerData;
        const { trainerData, battleTrainer } = randomTrainer(loopNum);

        const trainerBattle = new Battle(
          player,
          battleTrainer,
          currentPlayerData
        );
        currentPlayerData.stageToLoad = `wildBattle${loopNum}`;
        console.log(`\n${trainerData.name}:  ${trainerData.messages[0]}\n`);
        return Promise.all([
          `${trainerData.name}:  ${trainerData.defeatMessages[0]}`,
          trainerBattle.startBattle(),
        ]);
      })
      // === MENU ===
      .then(([defeatMessage, battleResult]) => {
        // skip block if loading game
        const stageID = `wildBattle${loopNum}`;
        const { stageToLoad } = currentPlayerData;
        if (stageToLoad !== stageID) return Promise.resolve();
        /////
        if (battleResult.isBlackedOut)
          return handleBlackout('trainer', defeatMessage.split(':')[0]);

        console.log(`\n${defeatMessage}\n`);
        return mainMenu(currentPlayerData, currentRivalData);
      })
      // ! wildBattle<loopNum> !
      .then(() => {
        // skip block if loading game
        const stageID = `wildBattle${loopNum}`;
        const { stageToLoad } = currentPlayerData;
        if (stageToLoad !== stageID) return Promise.resolve();
        /////
        const { player } = currentPlayerData;
        const randomLevel = Math.max(
          1,
          loopNum + Math.round(Math.random() * 3) - 2
        );
        const { battleTrainer } = randomWildPokemon(randomLevel);
        const randomBattle = new Battle(
          player,
          battleTrainer,
          currentPlayerData
        );

        currentPlayerData.stageToLoad = `town${loopNum + 1}`;
        return randomBattle.startBattle();
      })
      // .then(() => {
      //   // BATTLE HERE#
      //   const isTrainerBattle = Math.random() > 0.7;
      //   const { player } = currentPlayerData;
      //   const level = player.belt.forEach((ball) => {});
      //   const opponent = randomWildPokemon(level, null, 'Rattata');
      //   const { trainerData, battleTrainer } = opponent;
      //   const randomBattle = new Battle(
      //     player,
      //     battleTrainer,
      //     currentPlayerData,
      //     'introCatchBattle'
      //   );
      //   currentPlayerData.stageToLoad = 'introGoodbyeConv';
      //   return randomBattle.startBattle();
      // })
      .then((battleResult) => {
        if (battleResult.isBlackedOut) return handleBlackout('wild');
        // set currentPlayerData.player and currentPlayerData.PC etc.
        /////
        return gameLoop(loopNum + 1, currentPlayerData, currentRivalData);
      })
      .catch((err) => {
        console.log(err.message === 'quit' ? '\n\nThanks for playing!' : err);
      })
  );
  /////
}

function handleBlackout(battleType, winningTrainerName) {
  const lostMoney = Math.max(0, currentLoopNum * currentLoopNum * 10);
  const moneyMessage =
    battleType === 'wild'
      ? `${currentPlayerData.player.name} dropped ${lostMoney} in panic!`
      : `${currentPlayerData.player.name} gave ${winningTrainerName} ${lostMoney}₽.`;
  const blackoutPrompts = [
    {
      type: 'input',
      name: 'moneyConfirm',
      message: moneyMessage,
    },
    {
      type: 'list',
      name: 'blackoutChoice',
      message: 'What will you do?',
      choices: ['Return to last town', 'Quit'],
    },
  ];
  currentPlayerData.player.inventory.Money -= lostMoney;
  currentPlayerData.stageToLoad = `town${currentLoopNum}`;
  currentPlayerData.player.belt.forEach((ball) => ball.storage.healToFull());
  return saveGame({
    playerData: currentPlayerData,
    rivalData: currentRivalData,
  })
    .then(() => inquirer.prompt(blackoutPrompts))
    .then(({ blackoutChoice }) => {
      if (blackoutChoice === 'Quit') throw new Error('quit');
      else {
        return gameLoop(currentLoopNum, currentPlayerData, currentRivalData);
      }
    });
}

module.exports = { gameLoop };
