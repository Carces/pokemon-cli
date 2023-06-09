const inquirer = require('inquirer');
const fs = require('fs/promises');
const path = require('path');
const { Bulbasaur } = require('../../pokemon/species/bulbasaur.js');
const { Charmander } = require('../../pokemon/species/charmander.js');
const { Squirtle } = require('../../pokemon/species/squirtle.js');
const { PlayerData } = require('../data/player-data.js');
const { RivalData } = require('../data/rival-data.js');

let playerData;
let rivalData;
let playerName;

const playerNameQs = [
  {
    type: 'input',
    name: 'playerName',
    message: 'Please forgive my memory, what is your name?',
    default: 'Ash',
  },
];

const starterQs = [
  {
    type: 'list',
    name: 'starter',
    message: 'Which pokemon would you like?',
    choices: ['Charmander', 'Squirtle', 'Bulbasaur'],
  },
  {
    type: 'confirm',
    name: 'confirm',
    message: 'Would you like to give your new Pokemon a name?',
    default: false,
  },
  {
    type: 'input',
    name: 'pokemonName',
    message: 'What is its name?',
    when: (answers) => answers.confirm,
  },
];

const rivalQs = [
  {
    type: 'input',
    name: 'rivalName',
    message: `This is my grandson. He's been your rival since you were young. Erm... what's his name again?`,
    default: 'Gary',
  },
];

const confirmQs = [
  {
    type: 'list',
    name: 'answersToChange',
    message: `Would you like to change one of your answers?`,
    choices: [`I'm ready!`, 'My name', 'My Pokemon', `My rival's name`],
  },
  {
    type: 'input',
    name: 'nameChange',
    message: `Oh, am I saying it wrong? What is your name, then?`,
    when: (answers) => answers.answersToChange === 'My name',
  },
  {
    type: 'list',
    name: 'starterChange',
    message: `Oh, did you change your mind? Which Pokemon would you like instead?`,
    choices: ['Charmander', 'Squirtle', 'Bulbasaur'],
    when: (answers) => answers.answersToChange === 'My Pokemon',
  },
  {
    type: 'input',
    name: 'starterNameChange',
    message: `And what name would you like to give it?`,
    when: (answers) => answers.starterChange,
  },
  {
    type: 'input',
    name: 'rivalChange',
    message: `Did I forget my grandson's name again already? Oh dear... remind me, what was it?`,
    when: (answers) => answers.answersToChange === `My rival's name`,
  },
  {
    type: 'confirm',
    name: 'ready',
    message: `Begin game?`,
    default: true,
  },
];

function main() {
  console.log(
    '\n\nHello young person, I am professor Oak! I wonder if you have come here to begin your Pokemon journey... \n\n'
  );
  return inquirer.prompt(playerNameQs).then((answers) => {
    console.log(`\nAh, so your name is ${answers.playerName}!\n`);
    playerName = answers.playerName;
  });
}

function chooseStarter() {
  return inquirer.prompt(starterQs).then((answers) => {
    if (!answers.pokemonName) answers.pokemonName = answers.starter;
    else console.log(`\n${answers.pokemonName} is a great name!\n`);

    createPlayerData(playerName, answers.starter, answers.pokemonName);
  });
}

function createPlayerData(playerName, starter, pokemonName) {
  const starterPokemon =
    starter === 'Bulbasaur'
      ? new Bulbasaur(pokemonName, 5)
      : starter === 'Squirtle'
      ? new Squirtle(pokemonName, 5)
      : starter === 'Charmander'
      ? new Charmander(pokemonName, 5)
      : null;

  playerData = new PlayerData(playerName, starterPokemon);
}

function nameRival() {
  return inquirer.prompt(rivalQs).then((answers) => {
    console.log(
      `\nThat's right, I remember now! His name is ${answers.rivalName}!\n`
    );
    createRivalData(answers.rivalName);
    console.log(
      `\n${playerData.player.name}, your Pokemon journey is about to begin!\n`
    );
  });
}

function createRivalData(rivalName) {
  const starter = playerData.player.belt[0].storage.species;
  const rivalPokemon =
    starter === 'Bulbasaur'
      ? new Charmander(undefined, 5)
      : starter === 'Squirtle'
      ? new Bulbasaur(undefined, 5)
      : starter === 'Charmander'
      ? new Squirtle(undefined, 5)
      : null;

  rivalData = new RivalData(rivalName, rivalPokemon);
}

function confirmAnswers() {
  return inquirer.prompt(confirmQs).then((answers) => {
    if (answers.nameChange) {
      playerName = answers.nameChange;
      playerData.player.name = playerName;
    }
    if (answers.starterChange) {
      createPlayerData(
        playerName,
        answers.starterChange,
        answers.starterNameChange
      );
    }
    if (answers.rivalChange) createRivalData(answers.rivalChange);

    if (!answers.ready) return confirmAnswers();
    else {
      console.log(`\nThe world of Pokemon awaits!\n`);
      console.log(`-----`);
      console.log(`Saving...`);
      console.log(`-----`);
      const saveData = {
        playerData,
        rivalData,
      };
      return fs
        .writeFile(
          path.join(__dirname, '..', 'data', 'save-data.json'),
          JSON.stringify(saveData, null, 2)
        )
        .then(() => {
          console.log(`Saved!`);
        });
    }
  });
}

function beginGame() {
  return main()
    .then(() => {
      return chooseStarter();
    })
    .then(() => {
      return nameRival();
    })
    .then(() => {
      return confirmAnswers();
    });
}

module.exports = beginGame;
