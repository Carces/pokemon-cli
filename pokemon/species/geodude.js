const { Pokemon } = require('../pokemon');
const { movesData } = require('../../main-game/data/moves-data.js');

class Geodude extends Pokemon {
  constructor(
    name = 'Geodude',
    level,
    moves = ['Tackle', 'Defence Curl'],
    hitPoints = 10 + level * 2,
    attack = 18 + level * 2,
    defence = 22 + level * 2,
    speed = 6 + level * 2,
    accuracy = 100,
    catchDifficulty = 5,
    isEvolving
  ) {
    super(
      name,
      level,
      ['rock', 'ground'],
      moves,
      hitPoints,
      attack,
      defence,
      speed,
      accuracy,
      catchDifficulty,
      isEvolving
    );
    this.species = 'Geodude';
    this.isEvolving = isEvolving;
    this.moveTable = {
      level6: ['Mud Sport'],
    };
    this.generateMoves();
    this.art = `
⠀⠀⠀⠀⠀⠀  ⠀ ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡀⣠⣶⣷⣦⠀⠀⠀⠀⠀
⠀⠀⠀⣠⣴⡰⣿⣿⣿⣿⡆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⠀⣠⣤⣤⣤⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣾⣿⣿⣿⢿⣿⣷⣦⡀⠀⠀
⠀⣰⣷⣿⡿⣿⡎⣿⣇⠿⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀⢰⣶⣶⣶⣿⣾⣿⣿⣿⣿⣿⣦⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⣿⣟⣿⣿⣿⣿⣿⣿⠀⠀
⠀⣶⣝⣿⡧⠟⣵⣿⣾⢺⣿⣟⠀⠀⠀⠀⠀⠠⣼⣾⣯⣿⣿⣽⣿⣿⣿⣿⣿⣿⣿⣿⣷⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠰⣷⡙⠟⣼⣿⣿⢟⣿⣿⣿⣷⠀
⠀⠘⢿⣷⣾⣿⣿⣿⣿⠷⠋⠀⠀⠀⠀⠀⢠⣾⣿⣽⣿⣿⣿⣿⣿⣿⣿⡫⢯⣷⣿⣿⣿⣿⣿⡂⢀⣀⡀⠀⠀⠀⣠⣤⣶⣬⣻⣡⣽⣛⣽⣿⣿⣿⣻⣾⠇
⠀⠀⠈⢿⣿⣿⣯⣿⣷⠀⠀⠀⠀⠀⠀⠀⣿⣿⣿⣟⡿⣿⣿⡿⣿⣻⣿⡇⣸⣿⣿⣿⣿⣿⣯⣾⣿⣿⣿⣷⣠⣾⣿⣿⣿⣿⣿⣿⣾⣿⠏⠉⠛⠻⠟⠁⠀
⠀⠀⠀⠀⠹⣿⣷⣿⣿⣿⣄⠀⠀⠀⠀⠀⠈⢻⣿⣿⣯⣰⣿⣿⣿⣿⣿⣿⣾⣿⣿⣿⣿⣿⣟⠟⠛⠿⠿⠻⡿⣿⣿⣿⣿⣿⣿⠿⠛⠉⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠈⢿⣿⣿⣿⣿⣿⡀⠀ ⣠⣶⣤⢺⣿⣿⣿⣿⠿⣿⣿⣿⣷⣾⣽⣻⢿⡿⠃⣾⣿⠀⠀⠀⠀⠀⠀⠈⠉⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠈⢿⣿⣿⣿⣿⣇⠀⣰⣿⣿⡿⠺⢿⢯⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⣾⣾⠟⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠙⠿⣿⣿⣿⣿⣿⠿⠁⠀⠀⠀⠁⠻⣿⣿⣿⣿⣿⣿⣛⣿⣿⠿⠋⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠙⠋⠉⠀⠀⠀⠀⠀⠀⠀⠀⠈⠉⠛⠛⠛⠛⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀`;
  }
}

module.exports = {
  Geodude,
};
