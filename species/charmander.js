const { Fire } = require('../types/fire')

class Charmander extends Fire {
    constructor(name, hitPoints, attackDamage) {
        super(name, hitPoints, attackDamage, 'ember')
    }
}

module.exports = {
    Charmander
}