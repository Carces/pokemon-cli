const { Trainer } = require('./trainer.js');

class WildPokemon extends Trainer {
  constructor(name, pokemonArr) {
    super(name, pokemonArr);
    this.isWild = true;
    this.pokemonArr = pokemonArr;
    this.wildPokeObj = this.pokemonArr[0];
  }
}

module.exports = { WildPokemon };
