const inquirer = require('inquirer');
const { Pokemon } = require('../pokemon/pokemon.js')
const { Trainer } = require('./trainers/trainer.js');
const { Player } = require('./trainers/player.js')
const { Charmander } = require('../pokemon/species/charmander.js');
const { Squirtle } = require('../pokemon/species/squirtle.js');
const { Bulbasaur } = require('../pokemon/species/bulbasaur.js');
const { Rattata } = require('../pokemon/species/rattata.js')
const { movesData } = require('../pokemon/moves-data.js')

class Battle {
    constructor(player, opponent) {
        this.player = player;
        this.opponent = opponent;
        this.playerPokemon = this.player.currentPokeball.storage
        this.opponentPokemon = this.opponent.currentPokeball.storage
        // this.currentTrainer = player;
        // this.currentTrainerPokemon = this.currentTrainer.currentPokeball.storage;
        // this.otherTrainer = opponent;
        // this.otherTrainerPokemon = this.otherTrainer.currentPokeball.storage;
        this.turnNumber = 1;
        this.battleOver = false;
        this.winner = null;
        this.loser = null;
    }

    startBattle() {
        console.log('\n');
        console.log(`${this.opponent.name} wants to fight!`);
        console.log('\n');
        this.setCurrentPokeballs()
        this.doBattle()
    }
    resolveTurn() {
        this.checkIfBattleOver(this.player).then(() => {
            this.checkIfBattleOver(this.opponent).then(() => {
                // this.changeCurrentTrainer();

                if (this.opponentPokemon.hitPoints.current) {
            // TO ADD: check if hp ratio is above x% and use healing item if they have one and trainer is not wildPokemon, try and run in other situation etc.
                    const moves = this.opponentPokemon.moves
                    const randomIndex = Math.floor(Math.random()*moves.length)
                    const randomMove = movesData[moves[randomIndex]]
                    this.fight(
                        randomMove,
                        this.opponentPokemon, 
                        this.playerPokemon, 
                    );
                }
                this.checkIfBattleOver(this.player).then(() => {
                    this.checkIfBattleOver(this.opponent).then(() => {
                        this.turnNumber++
                        // this.changeCurrentTrainer();
                        if (!this.battleOver) this.doBattle()
                        else this.doEndOfBattle()
                    })
                })
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
                return `${pokeName}: ${pokemon.hitPoints.current}/${pokemon.hitPoints.max}`
            })
            
            const pokemonChoices = pokemonListWithHP.map(pokemonWithHp => {
                const pokemonObj = trainer.getPokemon(pokemonWithHp.split(':')[0]).pokemonObj
                return !pokemonObj.hitPoints.current ? 
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
                this.playerPokemon = this.player.currentPokeball.storage
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
        },
        {
            type: 'list',
            name: 'move',
            message: `Choose your move...`,
            choices: this.playerPokemon.moves,
            when: (answers) => answers.action === 'Fight'
          }])
        .then((answers) => {
            if (answers.action === 'Fight') {
                this.fight(movesData[answers.move], this.playerPokemon, this.opponentPokemon);
                this.resolveTurn()
            }
            else if (answers.action === 'Pokemon') {
                this.choosePokemon(this.player).then(() => {
                    this.resolveTurn()
                })
            }
        });
    }

    setNextPokemon(trainer) {
      for (let i = 0; i < trainer.belt.length; i++) {
          const pokeball = trainer.belt[i]
          if (pokeball.storage && pokeball.storage.hitPoints.current) {
              trainer.currentPokeball = trainer.belt[i];
              this.opponentPokemon = this.opponent.currentPokeball.storage
              this.playerPokemon = this.player.currentPokeball.storage
              return true // tells setCurrentPokeballs that this trainer hasValidPokemon (i.e. with > 0 hitPoints)
          }
      }
      return false // otherwise tells setCurrentPokeballs false
    }
    setCurrentPokeballs(trainer) {

      if (!trainer) { // when called with no arguments in startBattle, throw out first pokemon with hitPoints for each trainer
          this.setNextPokemon(this.player)
          this.setNextPokemon(this.opponent)
          this.player.currentPokeball.throw();
          this.opponent.currentPokeball.throw();
      } 
      else {  // when called with one specific trainer in checkIfBattleOver, check if that trainer has any pokemon with hp
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
        console.log(`${this.winner.name} defeated ${this.loser.name}!`);
    }

    checkIfBattleOver(trainer) {
        //trainer.currentPokeball.storage prevents errors if checkIfBattleOver is called and setCurrentPokeballs has not correctly initialized, only possible in dev / testing environment eg. if setCurrentPokeballs is invoked only after a trainer's pokemon are all fainted and there is no pokemon in the default current pokeball
        if (trainer.currentPokeball.storage && !trainer.currentPokeball.storage.hitPoints.current) { 
            
            return this.setCurrentPokeballs(trainer).then(() => {
                if(!trainer.currentPokeball.storage.hitPoints.current){
                    this.winner = trainer === this.opponent ? this.player : this.opponent
                    this.loser = trainer === this.opponent ? this.opponent : this.player
                    this.battleOver = true;
                }
            })
        }
        else { // If pokemon still has hp, return an empty promise so that the function that called checkIfBattleOver can use .then on whatever checkIfBattleOver returns without errors
            return Promise.resolve()
        }
    }

    inBetweenTurns() {
        console.log('\n-------')
        console.log(`Turn ${this.turnNumber}`)
        console.log('-------\n')

        
///////////////////
        console.log("atk:", this.playerPokemon.attack, this.opponentPokemon.attack)
        console.log("def:", this.playerPokemon.defence, this.opponentPokemon.defence)
        ////////////
    }

    getCriticalHit() {
        return Math.floor((Math.random() + 0.2))
    }


    resolveStatusMove(move, user, target) {
        function modBy50(stat, stagesToModBy) {
            const stageOfStat = stat / 4
            return stat + (stageOfStat * stagesToModBy)
        }

        const targetsSelf = target === user
        const effect = targetsSelf ? move.effectOnSelf 
        : move.effectOnTarget
        const effectMessage = effect.modifier === 1 ? 'rose!'
        : effect.modifier > 1 ? 'rose sharply!'
        : effect.modifier === -1 ? 'fell!'
        : 'fell sharply!'
        const statAfterMod = +modBy50(target[effect.stat].current, effect.modifier).toFixed(2)

        user.useMove(move)

        if (statAfterMod <= target[effect.stat] * 0.25 || statAfterMod <= 1) {
            console.log (`${target.name}'s ${effect.stat} is already too low. ${move.name} had no effect!`)
            return
        }
        if (statAfterMod >= target[effect.stat] * 1.75 || statAfterMod >= 500) {
            console.log (`${target.name}'s ${effect.stat} is already too high. ${move.name} had no effect!`)
            return
        }
      
        target[effect.stat].current = statAfterMod
        target.activeEffects[move.name] = effect
        console.log(`${target.name}'s ${effect.stat} ${effectMessage}`)
    }

    fight(move, attackingPokemon, defendingPokemon) {
        const attacker = attackingPokemon.name;
        const defender = defendingPokemon.name;
        let hasValidTarget = defendingPokemon.hitPoints.current > 0

        if (!move.doesDamage) {
            if (move.effectOnSelf) this.resolveStatusMove(move, attackingPokemon, attackingPokemon)
            if (move.effectOnTarget) this.resolveStatusMove(move, attackingPokemon, defendingPokemon)
            return
        }

        // Calculate attacking pokemon's damage,
        const baseDamage = attackingPokemon.useMove(move, defendingPokemon);
        let damage = defendingPokemon.isResistantTo(move) ?
        1.25 * baseDamage : defendingPokemon.isWeakTo(move) ? 
        0.75 * baseDamage : baseDamage;
        // accounting for type weaknesses

        const isCriticalHit = this.getCriticalHit();
        damage += (isCriticalHit * 2);
        const finalDamage = +damage.toFixed(2)

        if (hasValidTarget){
            // Deal damage to defending pokemon
            defendingPokemon.takeDamage(finalDamage);
            const defendingHitPointRatio  = defendingPokemon.hitPoints.current / defendingPokemon.hitPoints.max;
            // and calculate how badly damaged it is now

            if (defendingPokemon.isResistantTo(move)) console.log ("It's super effective!");
            if (defendingPokemon.isWeakTo(move)) console.log ("It's not very effective...");
            if (isCriticalHit) console.log("It's a critical hit!")
            
            // Separator for clearer output
            console.log('\n')
            //////////////////////////////

            console.log(`${attacker} dealt ${finalDamage} damage`)
            console.log(`${defender} has ${defendingPokemon.hitPoints.current} hit points remaining`)

            // Separator for clearer output
            console.log('\n')
            //////////////////////////////

            console.log( 
                !defendingPokemon.hitPoints.current ? `${defender} fainted!`
                : defendingHitPointRatio > 0.8 ? `${defender} barely has a scratch...`
                : defendingHitPointRatio > 0.5 ? `${defender} is slightly damaged!`
                : defendingHitPointRatio > 0.25 ? `${defender} is heavily damaged!`
                : `${defender} is barely standing!`);
        }   

        else {
            console.log(`${attacker}'s ${move} missed because there was nothing to hit!`);
        }
    }

    changeCurrentTrainer() {
        [this.currentTrainer,
        this.otherTrainer] =
            [this.otherTrainer,
            this.currentTrainer]

        [this.currentTrainerPokemon,
        this.otherTrainerPokemon] =
            [this.otherTrainerPokemon,
            this.currentTrainerPokemon]
    }
}




const jeb = new Player('Jebediah')
const gerty = new Squirtle('Gerty', 1)
const maude = new Bulbasaur('Maude', 1)

const butch = new Trainer('Butch')
const phil = new Charmander('Phil', 1)
const paula = new Charmander('Paula', 1) 

// console.log(gerty)

gerty.takeDamage(20)
maude.takeDamage(20)
phil.takeDamage(20)
paula.takeDamage(20)

console.log(gerty)

jeb.catch(gerty)
jeb.catch(maude)
butch.catch(phil)
butch.catch(paula)

// console.log(gerty)

gerty.hitPoints.current = gerty.hitPoints.max
maude.hitPoints.current = maude.hitPoints.max
phil.hitPoints.current = phil.hitPoints.max
paula.hitPoints.current = paula.hitPoints.max

// console.log(jeb.pokemonList)
// console.log(jeb.belt)
// console.log(jeb.getPokemon('Gerty'))

// console.log(gerty)

gerty.addXp(4)
// console.log(gerty)

const testBattle = new Battle(jeb, butch)

testBattle.startBattle()

module.exports = { Battle }