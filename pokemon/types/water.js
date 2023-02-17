const { Pokemon } = require('../pokemon.js');

class Water extends Pokemon {
  constructor(name, level, moves, hitPoints, attack, defence, catchDifficulty) {
    super(
      name,
      level,
      'water',
      moves,
      hitPoints,
      attack,
      defence,
      catchDifficulty,
      catchDifficulty
    );
  }
}

module.exports = { Water };
