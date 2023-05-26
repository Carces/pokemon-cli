const { Pokemon } = require('../pokemon.js');

class Fire extends Pokemon {
  constructor(
    name,
    level,
    moves,
    hitPoints,
    attack,
    defence,
    speed,
    accuracy,
    catchDifficulty,
    isEvolving
  ) {
    super(
      name,
      level,
      'fire',
      moves,
      hitPoints,
      attack,
      defence,
      speed,
      accuracy,
      catchDifficulty,
      isEvolving
    );
  }
}

module.exports = { Fire };
