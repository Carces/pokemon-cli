const { Pokemon } = require('../pokemon.js');

class Caterpie extends Pokemon {
  constructor(
    name = 'Caterpie',
    level,
    moves = ['Tackle', 'String Shot'],
    hitPoints = 11 + level * 2,
    attack = 8 + level * 2,
    defence = 9 + level * 2,
    speed = 11 + level * 2,
    accuracy = 100,
    catchDifficulty = 1,
    isEvolving
  ) {
    super(
      name,
      level,
      ['bug'],
      moves,
      hitPoints,
      attack,
      defence,
      speed,
      accuracy,
      catchDifficulty,
      isEvolving
    );
    this.species = 'Caterpie';
    this.isEvolving = isEvolving;
    this.evolvesTo = { species: 'Metapod', level: 7 };
    this.moveTable = {};
    this.generateMoves();
    this.art = `
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⣀⣤⣤⣦⠤⠤⢀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⣶⣶⣦⣀⠀⣀⣴⣾⣿⡿⣟⣯⣶⣿⠟⠁⢹⣶⣤⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠈⠙⠛⠿⢷⣮⣭⣯⡷⠾⠛⢋⣉⣀⣤⢔⣽⠶⠾⢭⡢⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⢰⣷⣦⣄⠉⠀⢠⣶⣾⣿⣿⣿⡿⣿⠁⠀⠀⠀⠹⣴⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⣿⣿⣿⣷⣄⣠⣾⣿⣿⣿⣿⣿⣷⣿⡀⠀⠀⠀⢀⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⢻⣿⢟⣭⣯⣿⣯⣭⣝⡻⣿⣿⣿⣿⣻⢦⣤⣤⣿⣾⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠈⢱⣿⡿⣟⣛⡿⣿⣿⣿⣬⢿⣿⣿⣿⣿⣿⣿⣿⡿⣼⣆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⢺⢻⣿⣿⣿⣿⣷⣝⣿⣿⠇⠻⢿⣿⣿⣿⣿⠟⣵⣿⣿⣆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠸⢿⣿⣿⣿⣿⡟⠹⡃⠀⠀⢀⣬⣭⣵⣶⣿⣿⣿⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠁⣰⣭⣭⣵⣶⣿⣿⣿⣶⣼⣿⣿⣿⣿⣿⣿⣿⣿⡏⠀⠀⠀⠀⠀⠀⣠⣄⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⣠⣭⣻⣿⣿⣿⣿⣿⢿⣿⣝⢿⣿⣿⣿⣿⣿⣿⡟⠀⠀⠀⠀⠀⠀⣸⣿⣿⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠻⣿⡧⣿⣿⣿⣿⡯⣿⣿⣿⡇⠻⠿⣿⡿⠿⠋⠀⠀⠀⠀⠀⠀⠀⣿⣿⡿⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⢉⣟⣿⣿⣿⣿⣹⣛⣿⡕⣿⣿⣶⣾⠆⠀⠀⠀⠀⠀⠀⠀⠀⣿⡿⠁⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⣿⣿⣿⣿⣿⣿⣟⣟⡻⣸⣿⣿⠇⣦⡀⠀⠀⠀⠀⠀⠀⠀⣜⠁⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⢮⣛⠿⣿⣿⣿⣿⣿⡿⣸⢛⣥⣾⣿⣷⣦⢤⣄⣀⡠⣴⣶⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠐⠷⣶⣮⣽⣾⣿⣦⢙⠻⢿⣿⣿⢫⣿⣿⣿⠚⠋⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠙⠛⢛⣯⣵⣾⣷⣶⡦⣠⣬⣭⠌⠂⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠉⠉⠁⠈⠉⠁⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀`;
  }
}

module.exports = {
  Caterpie,
};
