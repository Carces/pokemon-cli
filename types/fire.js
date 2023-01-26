const { Pokemon } = require('../pokemon.js')

class Fire extends Pokemon {
    constructor(name, hitPoints, attackDamage, type='fire', move='tackle') {
        super(name, hitPoints, attackDamage, type, move)
    }

    isEffectiveAgainst(pokemon) {
        return pokemon.type === 'grass'
    }

    isWeakTo(pokemon) {
        return pokemon.type === 'water'
    }

}

module.exports = {Fire, }