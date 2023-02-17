const { Pokemon } = require('../pokemon.js');

class Normal extends Pokemon {
  constructor(name, level, moves, hitPoints, attack, defence, catchDifficulty) {
    super(
      name,
      level,
      'normal',
      moves,
      hitPoints,
      attack,
      defence,
      catchDifficulty
    );
  }
}

module.exports = { Normal };
