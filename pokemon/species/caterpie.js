const { Bug } = require('../types/bug.js');

class Caterpie extends Bug {
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
    this.evolvesTo = { species: 'Metapod', level: 7 };
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
  static moveTable = {};
}

module.exports = {
  Caterpie,
};
