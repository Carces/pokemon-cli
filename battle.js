class Battle {
    constructor(trainerOne, trainerTwo) {
        this.trainerOne = trainerOne;
        this.trainerTwo = trainerTwo;
        this.currentTurn = 0;
        this.battleOver = false;
    }

    fight(attackingPokemon) {
        const baseDamage = attackingPokemon.useMove();
        const damage = attackingPokemon.isEffectiveAgainst(defendingPokemon) ?
        1.25 * baseDamage : attackingPokemon.isWeakTo(defendingPokemon) ? 
        0.75 * baseDamage : baseDamage;
        defendingPokemon.takeDamage(damage);
        this.currentTurn = this.currentTurn ? 0 : 1;
        const defendingHealthRatio  = defendingPokemon.health / defendingPokemon.hitPoints;
        switch (defendingHealthRatio) {
            case (defendingHealthRatio > 0.8) :
                console.log(`The opponent's pokemon doesn't have a scratch...`)
            case (defendingHealthRatio > 0.5) :
                console.log(`The opponent's pokemon has taken some damage!`)
            case (defendingHealthRatio > 0.25) :
                console.log('It looks like you have nearly won the battle!')
            default:
                console.log('The opponents pokemon has no arms left!')
        }
        if(defendingPokemon.health === 0) {
            this.battleOver = true;
            console.log('Winning trainer smashed up the other trainer!!!');
        }
    }
}