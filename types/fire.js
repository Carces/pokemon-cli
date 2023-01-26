const { Pokemon } = require('../pokemon.js')

class Fire extends Pokemon {
    constructor(name, hitPoints, attackDamage, move='tackle') {
        super(name, hitPoints, attackDamage, 'fire', move)
    }

    isEffectiveAgainst(pokemon) {
        return pokemon.type === 'grass'
    }

    isWeakTo(pokemon) {
        return pokemon.type === 'water'
    }

}

module.exports = {Fire, }