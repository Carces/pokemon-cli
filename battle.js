const { Trainer } = require('./trainer.js');
const { Charmander } = require('./species/charmander.js');
const { Squirtle } = require('./species/squirtle.js');

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

    doBattle() {
        while (!this.battleOver) {
            this.inBetweenTurns();
            this.fight(
                this.currentTrainer.currentPokeball.storage, 
                this.otherTrainer.currentPokeball.storage, 
            );
            this.changeCurrentTrainer();
            if (this.currentTrainer.currentPokeball.storage.health) {
                this.fight(
                    this.currentTrainer.currentPokeball.storage, 
                    this.otherTrainer.currentPokeball.storage, 
                );
            }
            this.checkIfFightOver(this.currentTrainer, this.otherTrainer);
            this.checkIfFightOver(this.otherTrainer, this.currentTrainer);
            this.turnNumber++
        }
        this.doEndOfBattle()
    }

    doEndOfBattle() {
        console.log(`${this.victor.name} defeated ${this.loser.name}!`);
    }

    checkIfFightOver(trainerA, trainerB) {
        if (!trainerA.currentPokeball.storage.health) {
            const trainerBelt = trainerA.belt

            for (let i = 0; i < trainerBelt.length; i++) {
                const pokeball = trainerBelt[i]
                if (pokeball.storage && pokeball.storage.health) {
                    trainerA.currentPokeball = 
                    trainerBelt[i]
                    trainerA.currentPokeball.throw()
                    return;
                }
            }

            this.victor = trainerB;
            this.loser = trainerA;
            this.battleOver = true;
            return;
        }
    }

    inBetweenTurns() {
        console.log('-------')
        console.log(`Turn ${this.turnNumber}`)
        console.log('-------')
    }



    fight(attackingPokemon, defendingPokemon) {
        const attacker = attackingPokemon.name;
        const defender = defendingPokemon.name;

        let isTarget = defendingPokemon.health > 0


        // Calculate attacking pokemon's damage,
        const baseDamage = attackingPokemon.useMove();
        const damage = attackingPokemon.isEffectiveAgainst(defendingPokemon) ?
        1.25 * baseDamage : attackingPokemon.isWeakTo(defendingPokemon) ? 
        0.75 * baseDamage : baseDamage;
        // accounting for type weaknesses

        if (isTarget){
            // Deal damage to defending pokemon
            defendingPokemon.takeDamage(damage);
            const defendingHealthRatio  = defendingPokemon.health / defendingPokemon.hitPoints;
            // and calculate how badly damaged it is now

            if (damage > baseDamage) console.log ("It's super effective!");
            if (damage < baseDamage) console.log ("It's not very effective...");
            
            // Separator for clearer output
            console.log('...')
            //////////////////////////////

            console.log(`${this.currentTrainer.name}'s pokemon ${attacker} dealt ${damage} damage`)
            console.log(`${this.currentTrainer.name}'s pokemon ${defender} has ${defendingPokemon.health} hit points remaining`)

            console.log( 
                !defendingPokemon.health ? `${defender} fainted!`
                : defendingHealthRatio > 0.8 ? `${defender} doesn't have a scratch...`
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
const butch = new Trainer('Butch')


const phil = new Charmander('Phil', 10, 2)
const paula = new Charmander('Paula', 2, 2)  
const gerty = new Squirtle('Gerty', 10, 3)

jeb.catch(gerty)
butch.catch(phil)
butch.catch(paula)

const testBattle = new Battle(jeb, butch)

testBattle.doBattle()


