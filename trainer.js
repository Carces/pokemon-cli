const { Pokeball } = require('./pokeball.js')

class Trainer {
    constructor(name) {
        this.name = name
        this.belt = []
        while (this.belt.length < 6) this.belt.push(new Pokeball())
    }

    catch(pokemon) {
        let flag = 0
        
        for (const pokeball of this.belt) {
            if (pokeball.isEmpty()) {
                pokeball.throw(pokemon)
                flag = 1
                break
            }
        }
        if (!flag) console.log('No empty balls, the pokemon gave you a judgemental look and walked away')
    }

    getPokemon(pokeName) {
        for (const pokeball of this.belt) {
            if (pokeball.storage && pokeball.storage.name === pokeName) return pokeball.throw()
        }

        console.log('No such pokemon in your belt!')
    }
}

module.exports = { Trainer }