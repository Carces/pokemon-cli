const { Electric } = require('../types/electric');
const { movesData } = require('../../main-game/data/moves-data.js');

class Pikachu extends Electric {
  constructor(
    name = 'Pikachu',
    level,
    moves = ['Thunder Shock', 'Growl'],
    hitPoints,
    attack,
    defence,
    catchDifficulty = 7
  ) {
    super(name, level, moves, hitPoints, attack, defence, catchDifficulty);
    this.species = 'Pikachu';
    this.moveTable = {
      level6: ['Tail Whip'],
    };
    if (this.level > 1) {
      // Give highest level moves possible
      for (const movesArr in this.moveTable) {
        const movesLevel = movesArr.replace('level', '');

        if (this.level >= movesLevel && this.moves.length < 4) {
          this.moveTable[movesArr].forEach((move) => {
            if (this.moves.length < 4) this.moves.push(move);
          });
        }
      }
    }
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
