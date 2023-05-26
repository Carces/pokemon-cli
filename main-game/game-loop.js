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

function gameLoop(
  loopNum,
  currentPlayerData,
  currentRivalData,
  exitGame = false
) {
  const { stageToLoad } = currentPlayerData;

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

  // town encounter
  if (stageToLoad.startsWith('battle')) return Promise.resolve();

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

        return enterTown(
          currentPlayerData,
          currentRivalData,
          currentPlayerData.townsVisited[loopNum - 1]
        );
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
      // ! wildBattle<loopNum> !
      .then(([defeatMessage]) => {
        // skip block if loading game
        const stageID = `wildBattle${loopNum}`;
        const { stageToLoad } = currentPlayerData;
        if (stageToLoad !== stageID) return Promise.resolve();
        /////

        console.log(`\n${defeatMessage}\n`);

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
      .then(() => {
        // set currentPlayerData.player and currentPlayerData.PC etc.
        /////
        return exitGame
          ? saveGame({
              playerData: currentPlayerData,
              rivalData: currentRivalData,
            })
          : gameLoop(loopNum + 1, currentPlayerData, currentRivalData);
      })
      .catch((err) => {
        console.log(
          err.message === 'quit'
            ? '\n\nCome back soon, your Pokemon will be waiting!'
            : err
        );
      })
  );
  /////
}

module.exports = { gameLoop };
