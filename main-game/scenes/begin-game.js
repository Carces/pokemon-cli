const inquirer = require('inquirer');
const fs = require('fs/promises')
const path = require('path')
const { Bulbasaur } = require('../../pokemon/species/bulbasaur.js');
const { Charmander } = require('../../pokemon/species/charmander.js');
const { Squirtle } = require('../../pokemon/species/squirtle.js');
const { PlayerData } = require('../data/player-data.js');
const { RivalData } = require('../data/rival-data.js');

let playerData;
let rivalData;
let playerName;

const playerNameQs = [ {
  type: 'input',
  name: 'playerName',
  message: 'Please forgive my memory, what is your name?',
  default: 'Ash',
},
]

const starterQs = [ {
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
  when: (answers) => answers.confirm
},
]

const rivalQs = [  {
  type: 'input',
  name: 'rivalName',
  message: `This is my grandson. He's been your rival since you were young. Erm... what's his name again?`,
  default: 'Gary'
},
]

const confirmQs = [
{
  type: 'list',
  name: 'answersToChange',
  message: `Would you like to change one of your answers?`,
  choices: [`No, I'm ready!`, 'My name', 'My Pokemon', `My rival's name`],
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
  message: `Are you ready?`,
  default: true
},
]

function main() {
    console.log("Hello young person, I am professor Oak! I wonder if you have come here to begin your Pokemon journey... ")
    inquirer.prompt(playerNameQs).then((answers) => {
        console.log(`\nAh, so your name is ${answers.playerName}!`);
        playerName = answers.playerName;
        chooseStarter();
      });
}

function chooseStarter() {
    inquirer.prompt(starterQs).then(answers => {
      if (!answers.pokemonName) answers.pokemonName = answers.starter;
      else console.log(`${answers.pokemonName} is a great name!`);

      createPlayerData(playerName, answers.starter, answers.pokemonName);
      nameRival();
    })
}

function createPlayerData(playerName, starter, pokemonName) {
  const starterPokemon = 
  starter === 'Bulbasaur' ? new Bulbasaur(pokemonName, 1)
  : starter === 'Squirtle' ? new Squirtle(pokemonName, 1)
  : starter === 'Charmander' ? new Charmander(pokemonName, 1)
  : null;

  playerData = new PlayerData(playerName, starterPokemon);
}

function nameRival() {
  inquirer.prompt(rivalQs).then(answers => {
    console.log(`That's right, I remember now! His name is ${answers.rivalName}!`);
    createRivalData(answers.rivalName);
    console.log(`${playerData.player.name}, your Pokemon journey is about to begin!`);
    confirmAnswers();
  })
}

function createRivalData(rivalName) {
  const starter = playerData.player.belt[0].storage.species
  const rivalPokemon = 
  starter === 'Bulbasaur' ? new Charmander(undefined, 1)
  : starter === 'Squirtle' ? new Bulbasaur(undefined, 1)
  : starter === 'Charmander' ? new Squirtle(undefined, 1)
  : null;

  rivalData = new RivalData(rivalName, rivalPokemon);
}

function confirmAnswers() {
  inquirer.prompt(confirmQs).then(answers => {
    if (answers.nameChange) {
      playerName = answers.nameChange
      playerData.player.name = playerName;
      console.log('>>>>>', playerName, playerData.player.name)
    }
    if (answers.starterChange) {
      createPlayerData(playerName, answers.starterChange, answers.starterNameChange)
      console.log('>>>>>', playerName, answers.starterNameChange)

    }
    if (answers.rivalChange) createRivalData(answers.rivalChange)

    if (!answers.ready) confirmAnswers()
    else {
      console.log(`The world of Pokemon awaits!`)
      console.log(`-----`)
      console.log(`Saving...`)
      console.log(`-----`)
      const saveData = {
        playerData,
        rivalData,
      }
      fs.writeFile(path.join(__dirname, '..', 'data', 'save-data.json'), JSON.stringify(saveData, null, 2))
      .then(() => {
        console.log(`Saved!`)
      })
    }
  })
}

main();

module.exports = { playerData, rivalData }