const { PokeBall } = require('./poke-ball')

class UltraBall extends PokeBall {
    constructor(owner, ballType = {name: 'Ultra', catchRate: 2}, price = 1200) {
        super(owner, ballType, price)
    }
}

module.exports = { UltraBall }