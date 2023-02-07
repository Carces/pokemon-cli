const { Pokemon } = require('../pokemon.js')

class Fire extends Pokemon {
    constructor(name, level = 1, move = 'tackle', catchDifficulty = 5, hitPoints = level*7.5, attack = level*5, defence = level*5 ) {
        super(name, level = 1, 'fire', move = 'tackle', catchDifficulty = 5, hitPoints = level*7.5, attack = level*5, defence = level*5 )
    }

    isEffectiveAgainst(pokemon) {
        return pokemon.type === 'grass'
    }

    isWeakTo(pokemon) {
        return pokemon.type === 'water'
    }

}

module.exports = {Fire, }