const { PokeBall } = require('./poke-ball')

class GreatBall extends PokeBall {
    constructor(ballType = {name: 'Great', catchRate: 1.5}, price = 600) {
        super(ballType, price)
    }
}

module.exports = { GreatBall }