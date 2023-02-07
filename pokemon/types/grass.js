const { Pokemon } = require('../pokemon.js')

class Grass extends Pokemon {
    constructor(name, level, move, catchDifficulty, hitPoints, attack, defence) {
        super(name, level, 'grass', move, catchDifficulty, hitPoints, attack, defence)
    }

    isEffectiveAgainst(pokemon) {
        return pokemon.type === 'water'
    }

    isWeakTo(pokemon) {
        return pokemon.type === 'fire'
    }

}

module.exports = {Grass, }