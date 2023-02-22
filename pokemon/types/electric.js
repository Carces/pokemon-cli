const { Pokemon } = require('../pokemon.js');

class Electric extends Pokemon {
  constructor(name, level, moves, hitPoints, attack, defence, catchDifficulty) {
    super(
      name,
      level,
      'electric',
      moves,
      hitPoints,
      attack,
      defence,
      catchDifficulty,
      catchDifficulty
    );
  }
}

module.exports = { Electric };
