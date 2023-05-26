const { Electric } = require('../types/electric');
const { movesData } = require('../../main-game/data/moves-data.js');

class Pikachu extends Electric {
  constructor(
    name = 'Pikachu',
    level,
    moves = ['Thunder Shock', 'Growl'],
    hitPoints = 9 + level * 2,
    attack = 13 + level * 2,
    defence = 8 + level * 2,
    speed = 20 + level * 2,
    accuracy = 100,
    catchDifficulty = 7,
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
    this.species = 'Pikachu';
    this.art = `
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⣾⡆⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⣾⣿⣿⡇⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣰⣿⣿⣿⠏⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣼⣿⣿⡿⠋⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣠⣤⣶⣶⣶⣿⣶⣿⣿⡋⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⣴⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠿⣆⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⣀⣠⣤⣶⣶⣶⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣏⠃⢸⣧⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠻⣿⣿⣿⣿⣿⣿⠿⠟⣫⣿⣿⠁⠺⠙⣿⣿⣿⣿⡷⢿⢿⣿⣿⣿⠀⠀⣠⣶⣶
⠀⠀⠀⠀⠀⠀⠀⠉⠉⠉⠁⠀⠀⠈⣿⣿⣿⣦⣤⣼⣿⣿⡛⠉⠀⠀⢸⣿⣿⣿⣀⢸⣿⣿⣿
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡀⢸⣿⠋⠉⠉⠻⣿⣿⣷⡀⠀⠀⢸⣿⣿⣿⡿⣾⣿⣿⡿
⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⣀⢴⣾⣿⣿⣾⣤⡀⠀⢠⣿⣿⣿⣷⡀⠀⣼⣿⣿⡿⣽⣿⣿⣿⠇
⠀⢀⣀⣠⣤⣶⣶⣾⣿⣿⣿⣮⢿⣿⣿⣿⣿⣿⣾⣿⣿⣿⣿⣿⣿⣾⣿⣿⣿⣿⣿⣿⣿⠏⠀
⢻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣯⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠃⠀⠀
⠸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⣻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣧⠀⠀⠀
⠀⣿⣿⣿⣿⣿⣿⣿⣿⣿⠿⢟⣿⣿⡟⠁⣝⣻⣿⡿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡄⠀⠀
⠀⢸⣿⣿⣿⣿⠿⠛⠉⠀⠀⢸⣿⡿⠀⠀⣿⣿⡿⣱⢬⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⡀⠀
⠀⠈⠿⠛⠉⠀⠀⠀⠀⠀⢀⣿⣿⡷⢶⣇⢹⣿⣾⡟⣿⣯⢮⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣧⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠉⠁⠀⠀⠀⢿⣿⣿⣷⢻⣿⡜⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠻⣿⣿⣧⢻⡇⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠙⠿⠷⢥⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠁⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠉⠛⠿⢿⡿⠿⠋⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢻⢧⠀⠀⠀⠀⠀`;
  }
  static moveTable = {
    level6: ['Tail Whip'],
  };
}

module.exports = {
  Pikachu,
};
