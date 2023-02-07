const { Pokemon } = require('../pokemon.js')

class Fire extends Pokemon {
    constructor(name, level, move, catchDifficulty, hitPoints, attack, defence) {
        super(name, level, 'fire', move, catchDifficulty, hitPoints, attack, defence)
    }

    isEffectiveAgainst(pokemon) {
        return pokemon.type === 'grass'
    }

    isWeakTo(pokemon) {
        return pokemon.type === 'water'
    }

}

module.exports = {Fire, }