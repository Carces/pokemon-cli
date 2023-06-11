const { Trainer } = require('./trainer.js');

class Player extends Trainer {
  constructor(
    name,
    pokemonArr,
    inventory = {
      Money: 500,
    }
  ) {
    super(name, pokemonArr, inventory);
    this.isPlayer = true;
  }
}

module.exports = { Player };
