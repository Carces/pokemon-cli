const { PokeBall } = require('./poke-ball')

class GreatBall extends PokeBall {
    constructor(owner, ballType = {name: 'Great', catchRate: 1.5}, price = 600) {
        super(owner, ballType, price)
    }
}

module.exports = { GreatBall }