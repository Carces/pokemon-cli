const { Pokemon } = require('../pokemon.js');

class Grass extends Pokemon {
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
      'grass',
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

module.exports = { Grass };
