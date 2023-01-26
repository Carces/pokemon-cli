const { Water } = require('../types/water')

class Squirtle extends Water {
    constructor(name, hitPoints, attackDamage) {
        super(name, hitPoints, attackDamage, 'water gun')
    }
}

module.exports = {
    Squirtle
}