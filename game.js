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
const { Conversation } = require('./utils/Conversation');
const { gameLoop } = require('./main-game/game-loop');
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
  // LOAD GAME
  .then(() => {
    return loadGame();
  })
  // INIT currentPlayerData
  .then(({ playerData, rivalData }) => {
    currentPlayerData = playerData;
    currentRivalData = rivalData;
    currentPlayer = currentPlayerData.player;
    currentRival = currentRivalData.rival;
    return createDelay(100);
  })
  // [ introRivalConv ]
  .then(() => {
    // skip block if loading game
    const stageID = 'introRivalConv';
    const { stageToLoad } = currentPlayerData;
    if (stageToLoad !== stageID) return Promise.resolve();
    /////

    const { player } = currentPlayerData;
    const { rival } = currentRivalData;
    const messages = [
      { npc: 0, text: `You chose ${player.belt[0].storage.species}?` },
      { npc: 0, text: `OK, well...` },
      { npc: 0, text: `Then I choose ${rival.pokemonList[0]}!`, delay: 1000 },
      {
        npc: 0,
        text: `Your ${player.belt[0].storage.species} looks weak, I bet my ${rival.pokemonList[0]} could beat it in a battle, easy!`,
      },
      { npc: 0, text: `I'll prove it!` },
    ];
    const npcs = [rival.name];
    const introConversation = new Conversation(npcs, messages);
    currentPlayerData.stageToLoad = 'introRivalBattle';
    return introConversation.start();
  })
  // ! introRivalBattle !
  .then(() => {
    // skip block if loading game
    const stageID = 'introRivalBattle';
    const { stageToLoad } = currentPlayerData;
    if (stageToLoad !== stageID) return Promise.resolve();
    /////

    const { player } = currentPlayerData;
    const { rival } = currentRivalData;

    const introBattle = new Battle(
      player,
      rival,
      currentPlayerData,
      'introRival'
    );
    currentPlayerData.stageToLoad = 'introRivalPostConv';
    return introBattle.startBattle();
  })
  // [ introRivalPostConv ]
  .then((res) => {
    if (res) currentPlayerData = res.currentPlayerData;
    // skip block if loading game
    const stageID = 'introRivalPostConv';
    const { stageToLoad } = currentPlayerData;
    if (stageToLoad !== stageID) return Promise.resolve();
    /////

    const { player } = currentPlayerData;
    const { rival } = currentRivalData;
    const npcs = ['Professor Oak'];
    const messages = [
      {
        npc: 0,
        text: res.introRivalBattleLost
          ? `Oh dear, ${rival.name} started a fight again? It's OK that you lost, he's been training for a while!`
          : `Oh, you defeated ${rival.name}? He'll be really fired up now!`,
      },
      {
        npc: 0,
        text: `Apologies for my grandson, he can be a bit hot-headed...`,
      },
      {
        npc: 0,
        text: `Still, win or lose, battling is part of becoming a Pokemon master!`,
        delay: 1000,
      },
      {
        npc: 0,
        text: `Your poor ${player.belt[0].storage.species} looks tired though, let me heal it for you!`,
      },
      {
        text: `${player.pokemonList[0]} was fully healed!`,
        delay: 2000,
      },
      {
        npc: 0,
        text: `In the future, you can heal your Pokemon by visiting the Pokemon Centre in any town, or by using items like potions. Here, I'll give you a potion for later!`,
      },
      {
        text: 'You got 1 potion! Use it to heal your Pokemon in or out of battle.',
      },
      {
        npc: 0,
        text: `Take good care of your Pokemon and they'll take care of you!`,
      },
      {
        npc: 0,
        text: `Now you've experienced a Pokemon battle, it's time for you to learn the other key to becoming a Pokemon master.`,
      },
      {
        npc: 0,
        text: `Let's go catch a wild Pokemon! There's some tall grass just behind my lab...\n`,
      },
      {
        npc: 0,
        text: `Here, this is a Pokeball. Use it on a wild Pokemon to catch it and store the Pokemon inside! Just be careful, you usually need to weaken the Pokemon first. I'll give you a few Pokeballs to get you started!`,
      },
      {
        text: 'You got 3 Pokeballs! Use them to catch wild Pokemon in battle.',
      },
      {
        npc: 0,
        text: `There, now why don't you walk through the grass and see what you can find?`,
      },
    ];
    const postIntroBattleConversation = new Conversation(npcs, messages);
    currentPlayerData.stageToLoad = 'introCatchBattle';
    return postIntroBattleConversation.start();
  })
  // ! introCatchBattle !
  .then(() => {
    // skip block if loading game
    const stageID = 'introCatchBattle';
    const { stageToLoad } = currentPlayerData;
    if (stageToLoad !== stageID) return Promise.resolve();
    /////

    currentPlayerData.player.inventory.Potion = 1;
    currentPlayerData.player.inventory['Poke Ball'] = 3;
    currentPlayerData.player.currentPokeball.storage.healToFull();

    const { player } = currentPlayerData;
    const { battleTrainer } = randomWildPokemon(1, 'Rattata');
    const randomBattle = new Battle(
      player,
      battleTrainer,
      currentPlayerData,
      'introCatchBattle'
    );
    currentPlayerData.stageToLoad = 'introGoodbyeConv';
    return randomBattle.startBattle();
  })
  // [ introGoodbyeConv ]
  .then((res) => {
    if (res) currentPlayerData = res.currentPlayerData;

    // skip block if loading game
    const stageID = 'introGoodbyeConv';
    const { stageToLoad } = currentPlayerData;
    if (stageToLoad !== stageID) return Promise.resolve();
    /////
    const { player } = currentPlayerData;
    const { rival } = currentRivalData;
    const newRattataName = player.belt.find((ball) => {
      return ball.storage.species === 'Rattata';
    }).storage.name;
    const npcs = ['Professor Oak', 'Mum'];
    const messages = [
      {
        npc: 0,
        text: `Well done! I'm sure your new Rattata${
          newRattataName === 'Rattata' ? '' : ` ${newRattataName}`
        } will be very happy with you!`,
      },
      {
        npc: 0,
        text: `Just remember, other Pokemon won't be so easy to catch.`,
      },
      {
        npc: 0,
        text: `For the best chance of success, weaken the Pokemon as much as possible first.`,
      },
      {
        npc: 0,
        text: `You can also buy more advanced Poke Balls to give you an edge!`,
      },
      {
        npc: 0,
        text: `Well, I think you're ready to get out and explore the world.`,
      },
      {
        npc: 0,
        text: `You should say goodbye to your mother first though. Good luck!`,
      },
      {
        text: `You tell your mum that you're leaving to go on an adventure... she looks worried.`,
      },
      {
        npc: 1,
        text: `Well, I suppose you're all grown up now, so I can't stop you...`,
      },
      {
        npc: 1,
        text: `Be careful! And come back to visit soon!`,
        delay: 1000,
      },
      {
        npc: 1,
        text: `Good luck!`,
      },
    ];
    const goodbyeMumConversation = new Conversation(npcs, messages);
    currentPlayerData.stageToLoad = 'town1';
    return goodbyeMumConversation.start();
  })
  // - startGameLoop -
  .then(() => {
    const { stageToLoad } = currentPlayerData;
    const loopNum = +stageToLoad.charAt(stageToLoad.length - 1);
    if (loopNum === '1' && stageToLoad.startsWith('town'))
      console.log(
        '\nYou leave behind your hometown and venture into the world.\n'
      );
    return gameLoop(loopNum, currentPlayerData, currentRivalData);
  });
// .then((res) => {
//   currentPlayerData = res.currentPlayerData;
//   console.log(currentPlayerData.PC, '<<<< PC FROM GAME.jS');
//   const { player } = currentPlayerData;
//   const level = player.currentPokeball.storage.level;
//   const opponent = randomWildPokemon(level, null, 'Rattata');
//   const { trainerData, battleTrainer } = opponent;
//   const randomBattle = new Battle(player, battleTrainer);
//   return randomBattle.startBattle();
// })
// .then(([saveSuccessful, playerData, rivalData]) => {
//   if (!saveSuccessful)
//     console.log('\n //// ERROR! Save unsuccessful //// \n');
//   currentPlayerData = playerData;
//   currentRivalData = rivalData;

//   const { player } = currentPlayerData;
//   const level = player.currentPokeball.storage.level;
//   const opponent = randomTrainer(level, null);
//   const { trainerData, battleTrainer } = opponent;
//   const randomBattle = new Battle(player, battleTrainer);
//   console.log('\nYou see a trainer approaching!\n');
//   console.log(`\n[${trainerData.name}]:  ${trainerData.messages[0]}\n`);
//   return createDelay(2000).then(() =>
//     Promise.all([randomBattle.startBattle(), opponent])
//   );
// })
// .then(({ battlePromise, opponent }) => {
//   // const { trainerData, battleTrainer } = opponent;
//   // console.log(`\n- ${trainerData.name}: ${trainerData.defeatMessages[0]}\n`);
//   console.log('BATTLE OVER');
//   console.log('BATTLE OVER');
//   console.log('BATTLE OVER');
//   console.log('BATTLE OVER');
//   console.log('BATTLE OVER');
//   console.log('BATTLE OVER');
// });
