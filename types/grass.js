const { Pokemon } = require('../pokemon.js')

class Grass extends Pokemon {
    constructor(name, hitPoints, attackDamage, move='tackle') {
        super(name, hitPoints, attackDamage, 'grass', move)
    }

    isEffectiveAgainst(pokemon) {
        return pokemon.type === 'water'
    }

    isWeakTo(pokemon) {
        return pokemon.type === 'fire'
    }

}

module.exports = {Grass, }