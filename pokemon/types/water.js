const { Pokemon } = require('../pokemon.js');

class Water extends Pokemon {
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
      'water',
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

module.exports = { Water };
