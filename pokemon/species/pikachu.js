const { Pokemon } = require('../pokemon');
const { movesData } = require('../../main-game/data/moves-data.js');

class Pikachu extends Pokemon {
  constructor(
    name = 'Pikachu',
    level,
    moves = ['Thunder Shock', 'Growl'],
    hitPoints = 9 + level * 4,
    attack = 13 + level * 2,
    defence = 8 + level * 2,
    spAttack = 12 + level * 2,
    spDefence = 10 + level * 2,
    speed = 20 + level * 2,
    accuracy = 100,
    catchDifficulty = 7,
    isEvolving
  ) {
    super(
      name,
      level,
      ['electric'],
      moves,
      hitPoints,
      attack,
      defence,
      spAttack,
      spDefence,
      speed,
      accuracy,
      catchDifficulty,
      isEvolving
    );
    this.species = 'Pikachu';
    this.isEvolving = isEvolving;
    this.moveTable = {
      level6: ['Tail Whip'],
    };
    this.generateMoves();
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
}

module.exports = {
  Pikachu,
};
