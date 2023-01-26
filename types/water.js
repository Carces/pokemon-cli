const { Pokemon } = require('../pokemon.js')

class Water extends Pokemon {
    constructor(name, hitPoints, attackDamage, move='tackle') {
        super(name, hitPoints, attackDamage, 'water', move)
    }

    isEffectiveAgainst(pokemon) {
        return pokemon.type === 'fire'
    }

    isWeakTo(pokemon) {
        return pokemon.type === 'grass'
    }

}

module.exports = {Water, }