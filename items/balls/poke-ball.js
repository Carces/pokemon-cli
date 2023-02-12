class PokeBall {
    constructor(ballType = {name: 'Poke', catchRate: 1}, price = 200) {
        this.storage = null;
        this.ballType = ballType
        this.price = price
    }

    throw(pokemon) {
        if(pokemon && ! this.storage) {
            const healthRatio = pokemon.hitPoints.max / pokemon.hitPoints.current;
            const random = Math.random()*5
            const ballRate = this.ballType.catchRate
            const catchChance = (random+healthRatio)*ballRate

            //////
            console.log("CATCH: ", catchChance, "DIFF: ", pokemon.catchDifficulty)
            //////

            if (catchChance >= pokemon.catchDifficulty) {
                console.log(`You caught ${pokemon.name}!`)
                this.storage = pokemon;
                return pokemon;
            }
            else {
                console.log(`Oh no! The Pokemon broke free!`)
                return null;
            }
        }
        else if(pokemon && this.storage) {
            console.log(`There is already a Pokemon in this ${this.ballType.name} Ball!`)
        }
        else if(this.storage) {
            console.log(this.storage.art)
            return this.storage;
        }
        else console.log(`The ${this.ballType.name} Ball is empty!`)
    }

    isEmpty() {
        return ! this.storage;
    }

    contains() {
        return (this.storage) ? this.storage.name : "empty ...";
    }
}

module.exports = { PokeBall, }