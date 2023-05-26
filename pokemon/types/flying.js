const { Pokemon } = require('../pokemon.js');

class Flying extends Pokemon {
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
      'flying',
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

module.exports = { Flying };
