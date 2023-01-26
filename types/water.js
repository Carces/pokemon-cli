const { Pokemon } = require('../pokemon.js')

class Water extends Pokemon {
    constructor(name, hitPoints, attackDamage, type='grass', move='tackle') {
        super(name, hitPoints, attackDamage, type, move)
    }

    isEffectiveAgainst(pokemon) {
        return pokemon.type === 'fire'
    }

    isWeakTo(pokemon) {
        return pokemon.type === 'grass'
    }

}

module.exports = {Water, }