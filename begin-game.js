const inquirer = require('inquirer');
const { Bulbasaur } = require('./species/bulbasaur');
const { Charmander } = require('./species/charmander');
const { Squirtle } = require('./species/squirtle');
const { PlayerData } = require('./player-data.js');

const startingData = new PlayerData();

const professorQuestions = [  {
    type: 'input',
    name: 'name',
    message: 'Please forgive my memory, what is your name?',
    default: 'Ash',
  },
  {
    type: 'list',
    name: 'starter',
    message: 'Which pokemon would you like?',
    choices: ['Charmander', 'Squirtle', 'Bulbasaur'],
  },
]

const furtherProfessorQuestions = [  {
    type: 'confirm',
    name: 'confirm',
    message: 'Would you like to give your new Pokemon a name?',
    default: false,
  },
  {
    type: 'input',
    name: 'name',
    message: 'What is its name?',
    default: 'Mark',
  },
]

function main() {
    console.log("Hello young person, I am professor Oak! I wonder if you have come here to begin your Pokemon journey... ")
    inquirer.prompt(professorQuestions).then((answers) => {
        console.log(`\nAh, so your name is ${answers.name}!`);
        console.log(`You chose ${answers.starter}!`);
        switch (answers.starter) {
            case 'Bulbasaur': {
                startingData.player = new PlayerData(answers.name, new Bulbasaur('Bulbasaur', 10, 3)); }
                break;
            case 'Charmander': {
                startingData.player = new PlayerData(answers.name, new Charmander('Charmander', 10, 3)); }
                break;
            case 'Squirtle': {   
                startingData.player = new PlayerData(answers.name, new Squirtle('Squirtle', 10, 3)); }
                break;
        }
        namePokemon();
      });
}

function namePokemon() {
    inquirer.prompt(furtherProfessorQuestions).then(answers => {
        console.log(`${answers.name} is a great name!`)
        startingData.player.belt[0].storage.name = answers.name;
    })
}

main();