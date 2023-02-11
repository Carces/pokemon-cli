const { PokeBall } = require('./poke-ball')

class MasterBall extends PokeBall {
    constructor(ballType = {name: 'Master', catchRate: 100}, price = null) {
        super(ballType, price)
    }
}

module.exports = { MasterBall }