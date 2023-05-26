const { Pokemon } = require('../pokemon.js');

class Bug extends Pokemon {
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
      'bug',
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

module.exports = { Bug };
