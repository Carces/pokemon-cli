const { Water } = require('../types/water');
const { movesData } = require('../../main-game/data/moves-data.js');

class Squirtle extends Water {
  constructor(
    name = 'Squirtle',
    level,
    moves = ['Tackle', 'Tail Whip'],
    hitPoints,
    attack,
    defence,
    catchDifficulty = 6
  ) {
    super(name, level, moves, hitPoints, attack, defence, catchDifficulty);
    this.species = 'Squirtle';
    this.moveTable = {
      level3: ['Water Gun'],
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
        ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣤⣴⣶⣿⣿⣿⣶⣴⣄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
        ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣾⣿⣿⣿⣿⣿⣿⣻⣿⢿⣿⣿⣆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
        ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠰⣿⣿⣿⣿⣿⣿⡏⠘⠿⢠⣿⣿⣿⣗⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
        ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢰⣿⣿⣿⣿⣿⣿⠃⠀⢀⣸⣿⣿⣿⣿⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
        ⠀⠀⠀⠀⠀⠀⠀⠀⠠⠿⣿⣿⣿⣿⣿⣿⣿⣷⣯⣥⣷⡿⣿⣿⣿⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
        ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠙⣮⣵⣶⣷⣶⣾⣷⣶⣿⣿⣿⣶⣿⣿⡏⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
        ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠻⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠟⣳⣎⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
        ⠀⠀⠀⠀⠀⠀⠀⢀⣀⣴⣴⡾⣷⣮⣯⣽⣛⣛⣛⡛⣩⣧⣾⣯⡅⢦⢦⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
        ⠀⠀⠀⣀⣀⣤⣾⣿⣿⣿⢯⣿⣿⣿⣿⣿⣿⣿⡿⣾⣿⣿⣿⣿⣿⡄⢦⢁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
        ⠀⠀⠀⢈⣿⡺⣿⣿⣿⡯⣿⣿⣿⣿⣾⢯⣭⡭⣼⡿⢿⣿⣿⣿⣿⢣⢐⣾⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
        ⠀⠀⠀⠙⠛⠛⠛⠛⠛⢹⣿⣿⣿⣿⣿⣸⣿⣟⣯⣾⣹⡿⠿⡿⣣⣿⢸⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
        ⠀⠀⠀⠀⠀⠀⠀⠀⠀⢹⡞⣿⣿⣿⡟⣿⣷⣯⣝⡿⠿⢟⣯⣷⣿⡏⠸⡿⠇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
        ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠸⣽⣿⣿⣷⡆⣯⣭⣿⣿⣯⣿⣿⣿⡟⣿⣇⠏⠁⠀⠀ ⣠⣶⣿⣿⣿⣶⣄⠀⠀⠀
        ⠀⠀⠀⠀⠀⠀⠀⠀⣠⣷⡻⣿⣿⣿⡇⣿⣿⣿⣿⣿⢗⣽⣾⣿⣿⣽⠀⠀⠀⣰⣾⣿⣿⡿⠿⢿⣿⣿⡄⠀⠀
        ⠀⠀⠀⠀⠀⠀⠀⢰⣿⣿⣿⣝⠿⡿⣗⡻⢿⣿⣿⢏⣿⣿⣿⣿⣿⣿⣄⢠⣾⣿⣿⣿⢳⣾⣿⣷⣿⣿⡇⠀⠀
        ⠀⠀⠀⠀⠀⠀⠀⢸⣿⣿⣿⣿⣷⡽⠻⢿⣷⣾⣽⠸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡸⣿⣿⣿⣿⡿⠀⠀⠀
        ⠀⠀⠀⠀⠀⠀⠠⢼⣿⣿⣿⣿⣿⠀⠀⠀⠈⠉⠈⠁⢹⣿⣿⣿⣿⣿⡇⠘⠻⠿⣿⣿⣿⣮⣿⡿⠋⠀⠀⠀⠀
        ⠀⠀⠀⠀⠀⠀⠀⠉⠘⠛⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢿⣿⣿⣿⣿⣇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
        ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠉⠙⠟⠉⠋⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀`;
  }
}

module.exports = {
  Squirtle,
};
