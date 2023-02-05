const { Trainer } = require('./trainer.js')

class Player extends Trainer {
    constructor(name, ...pokemon) {
        super(name, ...pokemon);
        this.isPlayer = true;
    }
}

module.exports = { Player }