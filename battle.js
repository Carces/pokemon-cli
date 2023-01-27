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
        this.setCurrentPokeballs();
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
            this.checkIfBattleOver();
            this.turnNumber++
            this.changeCurrentTrainer();
        }
        this.doEndOfBattle()
    }

    setCurrentPokeballs(trainer) {
        setCurrentPokeballsHelper(trainer || this.currentTrainer)
        if (!trainer) { //set current pokeball for second trainer only if method called with no params
            return setCurrentPokeballsHelper(this.otherTrainer)
        } 
        function setCurrentPokeballsHelper(trainer) {
            for (let i = 0; i < trainer.belt.length; i++) {
                const pokeball = trainer.belt[i]
                if (pokeball.storage && pokeball.storage.health) {
                    trainer.currentPokeball = trainer.belt[i];
                    trainer.currentPokeball.throw();
                    return 
                }
            }
        }
    }

    doEndOfBattle() {
        console.log(`${this.victor.name} defeated ${this.loser.name}!`);
    }

    checkIfBattleOver() {
        checkIfBattleOverHelper(this.currentTrainer, this.otherTrainer, this);
        checkIfBattleOverHelper(this.otherTrainer, this.currentTrainer, this);
        function checkIfBattleOverHelper(trainerA, trainerB, battle) {
            //trainerA.currentPokeball.storage prevents errors if checkIfBattleOver is called and setCurrentPokeballs has not correctly initialized, only possible in dev / testing environment eg. if setCurrentPokeballs is invoked only after a trainer's pokemon are all fainted and there is no pokemon in the default current pokeball
            if (trainerA.currentPokeball.storage && !trainerA.currentPokeball.storage.health) { 
                battle.setCurrentPokeballs(trainerA);
                if(! trainerA.currentPokeball.storage.health){
                    battle.victor = trainerB;
                    battle.loser = trainerA;
                    battle.battleOver = true;
                }
            }
        }
    }

    inBetweenTurns() {
        console.log('-------')
        console.log(`Turn ${this.turnNumber}`)
        console.log('-------')
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




// const jeb = new Trainer('Jebediah')
// const butch = new Trainer('Butch')


// const phil = new Charmander('Phil', 10, 2)
// const paula = new Charmander('Paula', 2, 2)  
// const gerty = new Squirtle('Gerty', 10, 3)

// jeb.catch(gerty)
// butch.catch(phil)
// butch.catch(paula)

// const testBattle = new Battle(jeb, butch)

// testBattle.doBattle()

module.exports = { Battle }