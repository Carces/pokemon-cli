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
    }

    fight(attackingPokemon, defendingPokemon) {
        const attacker = attackingPokemon.name;
        const defender = defendingPokemon.name;
        
        // Display turn number
        console.log('-------')
        console.log(`Turn ${this.turnNumber}`)
        console.log('-------')
        // with separators

        // Calculate attacking pokemon's damage,
        const baseDamage = attackingPokemon.useMove();
        const damage = attackingPokemon.isEffectiveAgainst(defendingPokemon) ?
        1.25 * baseDamage : attackingPokemon.isWeakTo(defendingPokemon) ? 
        0.75 * baseDamage : baseDamage;
        // accounting for type weaknesses


        // Deal damage to defending pokemon
        defendingPokemon.takeDamage(damage);
        const defendingHealthRatio  = defendingPokemon.health / defendingPokemon.hitPoints;
        // and calculate how badly damaged it is now

        if (damage > baseDamage) console.log ("It's super effective!");
        if (damage < baseDamage) console.log ("It's not very effective...");
        
        // Separator for clearer output
        console.log('...')
        //////////////////////////////

        console.log(`${attacker} dealt ${damage} damage`)
        console.log(`${defender} has ${defendingPokemon.health} hit points remaining`)

        console.log( 
            !defendingPokemon.health ? `${defender} fainted!`
            : defendingHealthRatio > 0.8 ? `${defender} doesn't have a scratch...`
            : defendingHealthRatio > 0.5 ? `${defender} is slightly damaged!`
            : defendingHealthRatio > 0.25 ? `${defender} is heavily damaged!`
            : `${defender} is barely standing!`);
        

            // If the attack causes the defending pokemon to faint...
        if (!defendingPokemon.health) {
            let flag = 0;
            const defenderBelt = this.otherTrainer.belt

            for (let i = 0; i < defenderBelt.length; i++) {
                const pokeball = defenderBelt[i]
                if (pokeball.storage && pokeball.storage.health) {
                    flag = 1;
                    this.otherTrainer.currentPokeball = 
                    defenderBelt[i]
                    this.otherTrainer.currentPokeball.throw()
                }
            }
            // ...check defending trainer's belt for a pokeball containing 
            // a pokemon that isn't at 0hp, then throw the pokeball and set 
            // trainerXPokemon property to the pokemon returned by throw()


            // If no pokeballs in defender's belt contain a conscious pokemon...
            if (!flag) {
                this.battleOver = true;
                console.log(`${this.currentTrainer.name} defeated ${this.otherTrainer.name}!`);
            }
            // end the battle and log a trainer defeated message
        }

        // Swap currenTrainer and otherTrainer and increment turnNumber...
        [this.currentTrainer,this.otherTrainer]=[this.otherTrainer,this.currentTrainer]
        this.turnNumber++
        // ... ready for next turn!

    }

    goToNextTurn() {
        this.fight(
            this.currentTrainer.currentPokeball.storage, 
            this.otherTrainer.currentPokeball.storage, 
            );
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

// testBattle.goToNextTurn()


