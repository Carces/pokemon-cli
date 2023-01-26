const { Grass } = require('../types/grass')

class Bulbasaur extends Grass {
    constructor(name, hitPoints, attackDamage) {
        super(name, hitPoints, attackDamage, 'vine whip')
    }
}

module.exports = {
    Bulbasaur
}