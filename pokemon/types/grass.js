const { Pokemon } = require('../pokemon.js');

class Grass extends Pokemon {
  constructor(name, level, moves, hitPoints, attack, defence, catchDifficulty) {
    super(
      name,
      level,
      'grass',
      moves,
      hitPoints,
      attack,
      defence,
      catchDifficulty
    );
  }
}

module.exports = { Grass };
