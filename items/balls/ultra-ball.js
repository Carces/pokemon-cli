const { PokeBall } = require('./poke-ball')

class UltraBall extends PokeBall {
    constructor(ballType = {name: 'Ultra', catchRate: 2}, price = 1200) {
        super(ballType, price)
    }
}

module.exports = { UltraBall }