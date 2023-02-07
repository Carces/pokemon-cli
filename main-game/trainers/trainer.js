const { PokeBall } = require('../../items/balls/poke-ball.js')

class Trainer {
    constructor(name, ...pokemon) {
        this.name = name
        this.belt = []
        while (this.belt.length < 6) this.belt.push(new PokeBall(this))
        for(let i = 0; i < [...pokemon].length; i++) {
            this.belt[i].storage = [...pokemon][i];
        }
        this.currentPokeball = this.belt[0]
        this.isPlayer = false;
        this.pokemonList = []
    }

    catch(pokemon) {
        console.log(`${this.name} tries to catch ${pokemon.name} in a pokeball...`)
        
        let flag = 0
        for (const pokeball of this.belt) {
            if (pokeball.isEmpty()) {
                pokeball.throw(pokemon)
                this.pokemonList.push(`${pokemon.name}`)
                flag = 1
                break
            }
        }
        if (!flag) console.log(`${this.name} has no empty balls, ${pokemon.name} ran away!`)
    }

    getPokemon(pokeName) {
        for (let i = 0; i < this.belt.length; i++) {
            if (this.belt[i].storage && this.belt[i].storage.name === pokeName) {
                // console.log({pokemonObj: this.belt[i].storage, index: i})
                return {pokemonObj: this.belt[i].storage, index: i}
            }
        }

        // console.log(`${this.name} doesn't have a pokemon called ${pokeName}`)
    }
}

module.exports = { Trainer }