const { Normal } = require('../../pokemon/types/normal.js');
const { movesData } = require('../../main-game/data/moves-data.js');

class Rattata extends Normal {
  constructor(
    name = 'Rattata',
    level,
    moves = ['Tackle', 'Tail Whip'],
    hitPoints,
    attack,
    defence,
    catchDifficulty = 2
  ) {
    super(name, level, moves, hitPoints, attack, defence, catchDifficulty);
    this.species = 'Rattata';
    this.moveTable = {
      level4: ['Quick Attack'],
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
        ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⣴⣦⣤⣄⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
        ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⣿⡯⣭⣟⢿⣷⣄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
        ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠙⢿⣿⣿⣿⡏⠻⢿⣷⣄⠀⠀⠀⠀⠀⠀⠀⠀
        ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠉⠉⠁⠀⠀⠉⢿⣦⠀⠀⠀⠀⠀⠀⠀
        ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣞⢷⣦⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢻⡆⠀⠀⠀⠀⠀⠀
        ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡜⣾⡟⣿⣿⠀⠀⠀⠀⠀⠀⠀⠀⣀⣠⣤⣤⡄⠀⠀⠀⠀⠀⠀⠀⠀⢿⡀⠀⠀⠀⠀⠀
        ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡗⣿⣵⣶⣿⣿⣿⣷⣶⣤⡀⣤⣾⢟⣻⣭⡽⣷⠀⠀⠀⠀⠀⠀⠀⠀⠈⡇⠀⠀⠀⠀⠀
        ⠀⠀⠀⠀⠀⠀⠈⠒⢄⡀⢠⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣾⣟⣵⣿⣿⣿⡇⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⡇⠀⠀⠀⠀⠀
        ⠀⠀⠀⠀⠀⠀⠀⢀⣤⣷⣿⣿⣿⣿⣿⣿⡿⠟⣯⣯⣿⣿⣿⣼⣿⣿⣿⣧⡟⢀⣠⣤⣶⣦⣤⣀⠀⢀⡇⠀⠀⠀⠀⠀
        ⠀⠀⠀⠀⠀⠀⠀⢸⣿⣿⣿⣿⣿⣿⣟⣁⣧⢦⣿⢯⣿⣿⠿⣿⣟⣻⣟⡾⣳⣶⣿⣿⣿⣿⣿⣿⣷⡼⠃⠀⠀⠀⠀⠀
        ⠀⠀⠀⠀⠀⠀⠀⠀⣝⣻⣿⣿⢟⢿⣿⣿⣿⣿⣿⣯⢽⣿⣿⣖⣒⣒⣶⣶⣿⣿⣿⣿⣽⣿⣿⣿⣿⣿⠀⠀⠀⠀⠀⠀
        ⠀⠀⠀⠀⢀⣠⣤⣶⣿⢿⣿⢯⢿⣷⣝⢿⣿⣿⣿⣿⣿⣿⣿⡿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡇⠀⠀⠀⠀⠀
        ⠀⠀⠈⣩⣿⣽⣿⣿⣽⣹⣯⣿⣷⡹⢯⣶⣝⢿⣿⣿⣿⣿⣟⣽⣿⣿⣿⣿⢿⣿⣿⣿⣿⡿⣿⣿⣿⣿⣷⡀⠀⠀⠀⠀
        ⠀⠀⠈⠉⠈⠉⠀⠀⠀⠀⠀⠀⠀⠈⣿⣿⣿⢹⣿⡿⠿⢿⣾⣿⣿⣿⣿⢯⣿⣿⣿⣿⣿⣿⡻⣿⣿⣿⣿⣿⣤⣀⠀⠀
        ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠰⢿⣿⣿⠟⠋⠀⢠⣿⣿⣿⣿⣿⡃⣽⣛⣛⠛⠛⠋⠁⠀⠉⠻⠿⣿⣿⠿⣿⠀⠀
        ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⣿⣿⣿⣿⡿⠱⠛⠕⠛⠁⠀⠀⠀⠀⠀⠀⠀⢀⣴⣿⣿⡿⠀⠀
        ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⢴⣾⣿⣿⡿⠋⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⡟⢫⠟⠁⠀⠀
        ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠠⠟⠩⠟⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀`;
  }
}

module.exports = {
  Rattata,
};
