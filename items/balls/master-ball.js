const { PokeBall } = require('./poke-ball')

class MasterBall extends PokeBall {
    constructor(owner, ballType = {name: 'Master', catchRate: 100}, price = null) {
        super(owner, ballType, price)
    }
}

module.exports = { MasterBall }