const inquirer = require('inquirer');
const { Pokemon } = require('../pokemon/pokemon.js')
const { Trainer } = require('./trainers/trainer.js');
const { Player } = require('./trainers/player.js')
const { Charmander } = require('../pokemon/species/charmander.js');
const { Squirtle } = require('../pokemon/species/squirtle.js');
const { Bulbasaur } = require('../pokemon/species/bulbasaur.js');
const { Rattata } = require('../pokemon/species/rattata.js')

class Battle {
    constructor(trainerOne, trainerTwo) {
        this.trainerOne = trainerOne;
        this.trainerTwo = trainerTwo;
        this.currentTrainer = trainerOne;
        this.otherTrainer = trainerTwo;
        this.turnNumber = 1;
        this.battleOver = false;
        this.victor = null;
        this.loser = null;
    }

    startBattle() {
        console.log('\n');
        console.log(`${this.trainerTwo.name} wants to fight!`);
        console.log('\n');
        this.setCurrentPokeballs()
        this.doBattle()
    }
    resolveTurn() {
        this.changeCurrentTrainer();
        if (this.currentTrainer.currentPokeball.storage.health) {
            this.fight(
                this.currentTrainer.currentPokeball.storage, 
                this.otherTrainer.currentPokeball.storage, 
            );
        }
        this.checkIfBattleOver(this.currentTrainer, this.otherTrainer).then(() => {
            this.checkIfBattleOver(this.otherTrainer, this.currentTrainer).then(() => {
                this.turnNumber++
                this.changeCurrentTrainer();
                if (!this.battleOver) this.doBattle()
                else this.doEndOfBattle()
            })
        })
    }
    choosePokemon(trainer) {
        if (!trainer.isPlayer) {
            this.setNextPokemon(trainer)
            trainer.currentPokeball.throw()
            return Promise.resolve()
        }
        else {
            const pokemonListWithHP = trainer.pokemonList.map(pokeName => {
                const pokemon = trainer.getPokemon(pokeName).pokemonObj
                return `${pokeName}: ${pokemon.health}/${pokemon.hitPoints}`
            })
            
            const pokemonChoices = pokemonListWithHP.map(pokemonWithHp => {
                const pokemonObj = trainer.getPokemon(pokemonWithHp.split(':')[0]).pokemonObj
                return !pokemonObj.health ? 
                    { name: pokemonWithHp, disabled: 'unconscious'}
                : pokemonObj.name === trainer.currentPokeball.storage.name ?
                    { name: pokemonWithHp, disabled: 'already out'}
                : pokemonWithHp
            })
                
            return inquirer.prompt([{
                type: 'list',
                name: 'pokemonChoice',
                message: `Choose a Pokemon to send out...`,
                choices: pokemonChoices
            }])
            .then((answers) => {
                const selectedPokemon = answers.pokemonChoice.split(':')[0]
                const selectedPokemonIndex = trainer.getPokemon(selectedPokemon).index
                trainer.currentPokeball = trainer.belt[selectedPokemonIndex]
                trainer.currentPokeball.throw()
            })
        }
    }
    doBattle() {
        this.inBetweenTurns();
        inquirer.prompt([{
            type: 'list',
            name: 'action',
            message: `Choose your action...`,
            choices: ['Fight', 'Pokemon', 'Item', 'Run'],
        }])
        .then((answers) => {
            if (answers.action === 'Fight') {
                this.fight(this.currentTrainer.currentPokeball.storage, this.otherTrainer.currentPokeball.storage);
                this.resolveTurn()
            }
            else if (answers.action === 'Pokemon') {
                this.choosePokemon(this.currentTrainer).then(() => {
                    this.resolveTurn()
                })
            }
        });
    }

    setNextPokemon(trainer) {
      for (let i = 0; i < trainer.belt.length; i++) {
          const pokeball = trainer.belt[i]
          if (pokeball.storage && pokeball.storage.health) {
              trainer.currentPokeball = trainer.belt[i];
              return true // tells setCurrentPokeballs that this trainer hasValidPokemon (i.e. with > 0 health)
          }
      }
      return false // otherwise tells setCurrentPokeballs false
    }
    setCurrentPokeballs(trainer) {

      if (!trainer) { // when called with no arguments in startBattle, throw out first pokemon with health for each trainer
          this.setNextPokemon(this.currentTrainer)
          this.setNextPokemon(this.otherTrainer)
          this.currentTrainer.currentPokeball.throw();
          this.otherTrainer.currentPokeball.throw();
      } 
      else {  // when called with one specific trainer in checkIfBattleOver, check if that trainer has any pokemon with health
          const currentPokeballIndex = trainer.belt.indexOf(trainer.currentPokeball)
          const hasRemainingPokemon = this.setNextPokemon(trainer)
          trainer.currentPokeball = trainer.belt[currentPokeballIndex] // Quick and dirty solution, maybe a better way to refactor this later. This was causing problems with choosing pokemon because setNextPokemon changes currentPokeball - first available pokemon is set as currentPokeball before player chooses a pokemon to send out, so one of their choices is incorrectly shown as 'already out'

          // If trainer does have remaining pokemon, let them choose one to throw out
          if (hasRemainingPokemon) {
              return this.choosePokemon(trainer)
          }
          else {
              return new Promise(resolve => {
                  resolve()
              })
          }
      } 
    }

    doEndOfBattle() {
        console.log(`${this.victor.name} defeated ${this.loser.name}!`);
    }

    checkIfBattleOver(trainerA, trainerB) {
        //trainerA.currentPokeball.storage prevents errors if checkIfBattleOver is called and setCurrentPokeballs has not correctly initialized, only possible in dev / testing environment eg. if setCurrentPokeballs is invoked only after a trainer's pokemon are all fainted and there is no pokemon in the default current pokeball
        if (trainerA.currentPokeball.storage && !trainerA.currentPokeball.storage.health) { 
            
            return this.setCurrentPokeballs(trainerA).then(() => {
                if(!trainerA.currentPokeball.storage.health){
                    this.victor = trainerB;
                    this.loser = trainerA;
                    this.battleOver = true;
                }
            })
        }
        else { // If pokemon still has health, return an empty promise so that the function that called checkIfBattleOver can use .then on whatever checkIfBattleOver returns without errors
            return Promise.resolve()
        }
    }

    inBetweenTurns() {
        console.log('\n-------')
        console.log(`Turn ${this.turnNumber}`)
        console.log('-------\n')
    }

    getCriticalHit() {
        return Math.floor((Math.random() + 0.2))
    }


    fight(attackingPokemon, defendingPokemon) {
        const attacker = attackingPokemon.name;
        const defender = defendingPokemon.name;

        let hasValidTarget = defendingPokemon.health > 0

        // Calculate attacking pokemon's damage,
        const baseDamage = attackingPokemon.useMove(defendingPokemon);
        let damage = attackingPokemon.isEffectiveAgainst(defendingPokemon) ?
        1.25 * baseDamage : attackingPokemon.isWeakTo(defendingPokemon) ? 
        0.75 * baseDamage : baseDamage;
        // accounting for type weaknesses

        const isCriticalHit = this.getCriticalHit();
        damage += (isCriticalHit * 2);

        const finalDamage = damage.toFixed(2)

        if (hasValidTarget){
            // Deal damage to defending pokemon
            defendingPokemon.takeDamage(finalDamage);
            const defendingHealthRatio  = defendingPokemon.health / defendingPokemon.hitPoints;
            // and calculate how badly damaged it is now

            if (attackingPokemon.isEffectiveAgainst(defendingPokemon)) console.log ("It's super effective!");
            if (attackingPokemon.isWeakTo(defendingPokemon)) console.log ("It's not very effective...");
            if (isCriticalHit) console.log("It's a critical hit!")
            
            // Separator for clearer output
            console.log('\n')
            //////////////////////////////

            console.log(`${this.currentTrainer.name}'s pokemon ${attacker} dealt ${finalDamage} damage`)
            console.log(`${this.otherTrainer.name}'s pokemon ${defender} has ${defendingPokemon.health} hit points remaining`)

            console.log('\n')

            console.log( 
                !defendingPokemon.health ? `${defender} fainted!`
                : defendingHealthRatio > 0.8 ? `${defender} barely has a scratch...`
                : defendingHealthRatio > 0.5 ? `${defender} is slightly damaged!`
                : defendingHealthRatio > 0.25 ? `${defender} is heavily damaged!`
                : `${defender} is barely standing!`);
        }   

        else {
            console.log(`${attacker}'s ${attackingPokemon.move} missed because there was nothing to hit!`);
        }
    }

    changeCurrentTrainer() {
        [this.currentTrainer,this.otherTrainer]=[this.otherTrainer,this.currentTrainer]
    }
}




const jeb = new Player('Jebediah')
const gerty = new Squirtle('Gerty', 1)
const maude = new Bulbasaur('Maude', 1)

const butch = new Trainer('Butch')
const phil = new Charmander('Phil', 1)
const paula = new Charmander('Paula', 1) 

gerty.takeDamage(7)
maude.takeDamage(7)
phil.takeDamage(7)
paula.takeDamage(7)
// console.log(gerty)
jeb.catch(gerty)
jeb.catch(maude)
butch.catch(phil)
butch.catch(paula)

gerty.health = gerty.hitPoints
maude.health = maude.hitPoints
phil.health = phil.hitPoints
paula.health = paula.hitPoints

// console.log(jeb.pokemonList)
// console.log(jeb.belt)
// console.log(jeb.getPokemon('Gerty'))

// console.log(gerty)

gerty.addXp(4)
// console.log(gerty)

const testBattle = new Battle(jeb, butch)

testBattle.startBattle()

module.exports = { Battle }