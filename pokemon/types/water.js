const { Pokemon } = require('../pokemon.js')

class Water extends Pokemon {
    constructor(name, level, move, catchDifficulty, hitPoints, attack, defence) {
        super(name, level, 'water', move, catchDifficulty, hitPoints, attack, defence)
    }

    isEffectiveAgainst(pokemon) {
        return pokemon.type === 'fire'
    }

    isWeakTo(pokemon) {
        return pokemon.type === 'grass'
    }

}

module.exports = {Water, }