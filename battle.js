const inquirer = require('inquirer');
const { Trainer } = require('./trainer.js');
const { Player } = require('./player.js')
const { Charmander } = require('./species/charmander.js');
const { Squirtle } = require('./species/squirtle.js');
const { Bulbasaur } = require('./species/bulbasaur.js');
const { Rattata } = require('./species/rattata.js')

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
        this.checkIfBattleOver().then(() => {
            this.turnNumber++
            this.changeCurrentTrainer();
            if (!this.battleOver) this.doBattle()
            else this.doEndOfBattle()
        })
    }
    choosePokemon(trainer) {
        if (!trainer instanceof Player) {
            setNextPokemon(trainer)
            trainer.currentPokeball.throw()
        }
        else {
            return inquirer.prompt([{
                type: 'list',
                name: 'pokemonChoice',
                message: `Choose a Pokemon to send out...`,
                choices: this.currentTrainer.pokemonList,
            }])
            .then((answers) => {
                const selectedPokemonName = answers.pokemonChoice.split(':')[0]
                const selectedPokemon = trainer.getPokemon(selectedPokemonName) // sets current pokeball to chosen pokemon, doesn't throw yet
                if (!trainer.currentPokeball.storage.health) {
                    console.log(`${selectedPokemonName} is unconscious!`)
                    this.choosePokemon(trainer)
                } 
                else {
                    trainer.getPokemon(selectedPokemonName)
                    trainer.currentPokeball.throw()
                }
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

    setCurrentPokeballs(trainer) {
        function setNextPokemon(trainer) {
            for (let i = 0; i < trainer.belt.length; i++) {
                const pokeball = trainer.belt[i]
                if (pokeball.storage && pokeball.storage.health) {
                    trainer.currentPokeball = trainer.belt[i];
                    return true // tells setCurrentPokeballs that this trainer hasValidPokemon (i.e. with > 0 health)
                }
                return false // otherwise tells setCurrentPokeballs false
            }
        }

        if (!trainer) { // when called with no arguments in startBattle, throw out first pokemon with health for each trainer
            setNextPokemon(this.currentTrainer)
            setNextPokemon(this.otherTrainer)
            this.currentTrainer.currentPokeball.throw();
            this.otherTrainer.currentPokeball.throw();
        } 
        else {  // when called with one specific trainer in checkIfBattleOver, check if that trainer has any pokemon with health
            const hasRemainingPokemon = setNextPokemon(trainer)

            // If trainer does have remaining pokemon, let them choose one to throw out
            if (hasRemainingPokemon) {
                console.log("does have remaining pokemon, returning choosePokemon promise")
                return this.choosePokemon(trainer)
            }
            // else {

            // }
        } 
    }

    doEndOfBattle() {
        console.log(`${this.victor.name} defeated ${this.loser.name}!`);
    }

    checkIfBattleOver() {
        return checkIfBattleOverHelper(this.currentTrainer, this.otherTrainer, this)
        .then(() => {
            checkIfBattleOverHelper(this.otherTrainer, this.currentTrainer, this);
        })
        
        console.log("second Check over")
        function checkIfBattleOverHelper(trainerA, trainerB, battle) {
            //trainerA.currentPokeball.storage prevents errors if checkIfBattleOver is called and setCurrentPokeballs has not correctly initialized, only possible in dev / testing environment eg. if setCurrentPokeballs is invoked only after a trainer's pokemon are all fainted and there is no pokemon in the default current pokeball
            if (trainerA.currentPokeball.storage && !trainerA.currentPokeball.storage.health) { 
                console.log("CHECKIF")
                return battle.setCurrentPokeballs(trainerA).then(() => {
                    if(!trainerA.currentPokeball.storage.health){
                        battle.victor = trainerB;
                        battle.loser = trainerA;
                        battle.battleOver = true;
                    }
                })
            }
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

        let isTarget = defendingPokemon.health > 0


        // Calculate attacking pokemon's damage,
        const baseDamage = attackingPokemon.useMove();
        let damage = attackingPokemon.isEffectiveAgainst(defendingPokemon) ?
        1.25 * baseDamage : attackingPokemon.isWeakTo(defendingPokemon) ? 
        0.75 * baseDamage : baseDamage;
        // accounting for type weaknesses

        const isCriticalHit = this.getCriticalHit();
        damage += (isCriticalHit * 2 * damage);

        if (isTarget){
            // Deal damage to defending pokemon
            defendingPokemon.takeDamage(damage);
            const defendingHealthRatio  = defendingPokemon.health / defendingPokemon.hitPoints;
            // and calculate how badly damaged it is now

            if (attackingPokemon.isEffectiveAgainst(defendingPokemon)) console.log ("It's super effective!");
            if (attackingPokemon.isWeakTo(defendingPokemon)) console.log ("It's not very effective...");
            if (isCriticalHit) console.log("It's a critical hit!")
            
            // Separator for clearer output
            console.log('\n')
            //////////////////////////////

            console.log(`${this.currentTrainer.name}'s pokemon ${attacker} dealt ${damage} damage`)
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




const jeb = new Trainer('Jebediah')
const gerty = new Squirtle('Gerty', 10, 3)
const maude = new Bulbasaur('Maude', 6, 2)

const butch = new Trainer('Butch')
const phil = new Charmander('Phil', 10, 2)
const paula = new Charmander('Paula', 2, 2)  


jeb.catch(gerty)
jeb.catch(maude)
butch.catch(phil)
butch.catch(paula)

console.log(jeb.pokemonList)
const testBattle = new Battle(jeb, butch)

testBattle.startBattle()

module.exports = { Battle }