const { Trainer } = require('./trainer.js')

class Player extends Trainer {
    constructor(name, pokemonArr) {
        super(name, pokemonArr);
        this.isPlayer = true;
    }
}

module.exports = { Player }