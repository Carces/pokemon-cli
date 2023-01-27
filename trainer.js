const { Pokeball } = require('./pokeball.js')

class Trainer {
    constructor(name, ...pokemon) {
        this.name = name
        this.belt = []
        while (this.belt.length < 6) this.belt.push(new Pokeball())
        for(let i = 0; i < [...pokemon].length; i++) {
            this.belt[i].storage = [...pokemon][i];
        }
        this.currentPokeball = this.belt[0]
        this.isPlayer = false;

    }

    catch(pokemon) {
        console.log(`${this.name} tries to catch ${pokemon.name} in a pokeball...`)
        
        let flag = 0
        
        for (const pokeball of this.belt) {
            if (pokeball.isEmpty()) {
                pokeball.throw(pokemon)
                flag = 1
                break
            }
        }
        if (!flag) console.log(`${this.name} has no empty balls, ${pokemon.name} ran away!`)
    }

    getPokemon(pokeName) {
        for (const pokeball of this.belt) {
            if (pokeball.storage && pokeball.storage.name === pokeName) return pokeball.throw()
        }

        console.log(`${this.name} doesn't have a pokemon called ${pokeName}`)
    }
}

module.exports = { Trainer }