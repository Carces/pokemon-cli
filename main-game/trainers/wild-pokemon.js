const { Trainer } = require('./trainer.js')

class WildPokemon extends Trainer {
    constructor(pokemonArr) {
        super('Wild Pokemon', pokemonArr);
        this.isWild = true;
        this.pokemonArr = pokemonArr
        this.wildPokeObj = this.pokemonArr[0]
    }
}

module.exports = { WildPokemon }