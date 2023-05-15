const { createDelay } = require('../utils/delay');
const { saveGame } = require('./save-game');
const { enterTown } = require('./scenes/town');

function gameLoop(
  loopNum,
  currentPlayerData,
  currentRivalData,
  exitGame = false
) {
  const { stageToLoad } = currentPlayerData;

  // town encounter
  return stageToLoad.startsWith('battle')
    ? Promise.resolve()
    : enterTown(currentPlayerData, currentRivalData)
        .then(() => {
          currentPlayerData.stageToLoad = `battle${loopNum}`;
          return loadGame();
        })
        /////
        .then(({ playerData, rivalData }) => {
          currentPlayerData = playerData;
          currentRivalData = rivalData;
          return createDelay(100);
        })
        // battle encounter
        // one then block for each battle.
        // within later then blocks, only do their battle logic if stage < 10, < 5 etc.
        // Probably start with two battles, go to 3 battles starting stage 5. Maybe 5 battles at stage 20?
        // use rng to choose whether each battle is a wild trainer or not, 70/30 in favour of wild(?)
        .then(() => {
          // set currentPlayerData.player and currentPlayerData.PC etc.
          /////
          return exitGame
            ? saveGame({ currentPlayerData, currentRivalData })
            : gameLoop(loopNum + 1, currentPlayerData, currentRivalData);
        });
  /////
}

module.exports = { gameLoop };
