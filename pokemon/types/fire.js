const { Pokemon } = require('../pokemon.js');

class Fire extends Pokemon {
  constructor(name, level, moves, hitPoints, attack, defence, catchDifficulty) {
    super(
      name,
      level,
      'fire',
      moves,
      hitPoints,
      attack,
      defence,
      catchDifficulty
    );
  }
}

module.exports = { Fire };
