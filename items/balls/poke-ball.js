class Pokeball {
    constructor(owner, ballType = {name: 'Poke', catchRate: 1}, price = 200) {
        this.storage = null;
        this.owner = owner
        this.ballType = ballType
        this.price = price
    }

    throw(pokemon) {
        if(pokemon && ! this.storage) {
            const healthRatio = pokemon.hitPoints / pokemon.health;
            const random = Math.random()*2.5
            const ballRate = this.ballType.catchRate
            const catchChance = (random+ballRate)*healthRatio
            // console.log("CATCH: ", catchChance, "DIFF: ", pokemon.catchDifficulty)

            if (catchChance >= pokemon.catchDifficulty) {
                console.log(`You caught ${pokemon.name}!`)
                this.storage = pokemon;
                // TO ADD: remove ball from inv
            }
            else {
                console.log(`Oh no! The Pokemon broke free!`)
                // TO ADD: remove ball from inv
            }
        }
        else if(pokemon && this.storage) {
            console.log(`There is already a Pokemon in the ${this.ballType.name} Ball!`)
        }
        else if(this.storage) {
            console.log(this.owner.isPlayer ? `Go, ${this.storage.name}!`
                    : `${this.owner.name} sent out ${this.storage.name}!`)
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

module.exports = { Pokeball, }