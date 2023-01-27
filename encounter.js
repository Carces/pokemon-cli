const { Battle } = require('./battle.js')
const { Trainer } = require('./trainer.js')
const { Bulbasaur } = require('./species/bulbasaur.js')
const { Squirtle } = require('./species/squirtle.js')
const inquirer = require('inquirer') //called commonsjs syntax, c.f. native esm more modern

const player = new Trainer('Albert');
const opponentTrainer = new Trainer('Norbert');

const wilbert = new Bulbasaur('Wilbert', 10, 10)
const eileen = new Squirtle('Squirtle', 10, 10)

player.catch(wilbert);
opponentTrainer.catch(eileen);

const actionPrompt = {
    type: 'list',
    name: 'action',
    message: 'What will you do?',
    choices: ['Fight', 'Run'],
  };


function main() {
    console.log('You see a trainer, do you run or fight?');
    engageTrainer();
  }

function engageTrainer() {
    inquirer.prompt(actionPrompt).then((options) => {
        if (options.action === 'Run') {
          console.log('You go home, never play with Pokemon again and have a respectful career as an accountant.');
        } else {
          console.log("It's time to Poke-battle!");
          const firstTrainerBattle = new Battle(player, opponentTrainer);
          firstTrainerBattle.doBattle();
        }
      });
}

  main();