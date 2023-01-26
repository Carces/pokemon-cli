const { Pokemon } = require('../pokemon.js')

class Grass extends Pokemon {
    constructor(name, hitPoints, attackDamage, type='grass', move='tackle') {
        super(name, hitPoints, attackDamage, type, move)
    }

    isEffectiveAgainst(pokemon) {
        return pokemon.type === 'water'
    }

    isWeakTo(pokemon) {
        return pokemon.type === 'fire'
    }

}

module.exports = {Grass, }