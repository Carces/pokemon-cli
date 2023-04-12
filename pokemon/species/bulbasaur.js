const { Grass } = require('../types/grass');
const { movesData } = require('../../main-game/data/moves-data.js');

class Bulbasaur extends Grass {
  constructor(
    name = 'Bulbasaur',
    level,
    moves = ['Tackle', 'Growl'],
    hitPoints,
    attack = 9 + level * 2,
    defence = 11 + level * 2,
    catchDifficulty = 6
  ) {
    super(name, level, moves, hitPoints, attack, defence, catchDifficulty);
    this.species = 'Bulbasaur';
    this.moveTable = {
      level3: ['Vine Whip'],
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
        ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⠀⠀⡀⠀⠀⠀⠀⠀
        ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡀⣀⣤⣾⢠⣾⢀⡀⠀⠀⠀⠀
        ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⣤⣶⣿⣿⣿⣿⠿⣿⣿⣿⣿⣽⣷⣿⡟⣾⠀⠀⠀⠀⠀
        ⠀⠀⠀⠀⠀⠀⠀⣄⢀⠀⠀⠀⠀⠀⠀⢠⣿⣿⣿⣿⣿⡟⠩⣾⣿⣿⣿⣿⣿⣿⣿⣿⡗⣿⠀⠀⠀⠀⠀
        ⠀⠀⠀⠀⠀⢠⣾⣿⣿⣽⣴⣶⣶⣶⣶⣾⣭⣿⣩⣯⣶⣿⣿⡜⣿⣿⣿⣿⣿⣿⣿⣿⣷⢹⣧⠀⠀⠀⠀
        ⠀⠀⠀⠀⠀⢸⣿⣿⣿⣿⢿⡿⠏⠁⢀⣴⣿⣿⣿⣿⣿⣿⣿⣿⣻⣿⣿⣿⣿⣿⣿⣿⣿⡄⢿⣧⠀⠀⠀
        ⠀⠀⠀⠀⣰⣿⣿⣿⡿⣷⣅⠀⣠⣶⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡸⢿⣿⣿⣿⣿⣿⣿⣿⣿⠸⣿⣧⠀⠀
        ⠀⠀⠀⣘⣿⢛⣿⣟⣠⣿⣿⡿⣿⣿⣿⣯⣿⢟⠏⠙⠻⣿⣿⣿⣇⣮⡹⢿⣿⣿⣿⣿⣿⣿⡇⣿⣿⡆⠀
        ⠀⠀⢰⣽⠓⣿⣿⣿⣿⣟⠋⠀⣿⣿⣯⣿⣿⣿⠼⣿⡆⢻⣿⣿⣿⣸⠟⠊⠙⢿⣿⣿⣿⠿⣿⣿⣿⡿⠀
        ⠀⠀⣸⢿⡠⢿⣿⣿⣿⣿⣿⣶⣿⣿⣿⡟⣿⣧⠀⢻⣃⣘⣿⣿⣿⣿⣷⠀⠀⠀⠈⠉⢭⣶⣿⣿⣿⠃⠀
        ⠀⠀⠛⡻⣷⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣧⣿⣿⣼⣯⣵⡾⣿⣿⣿⣿⣿⣷⡀⠀⠀⢀⣧⡙⣿⠿⠋⠀⠀
        ⠀⠀⠀⠉⠲⣭⡛⠛⠻⠿⠿⠿⠿⠿⠛⠛⠛⠟⢻⣩⣶⣾⣿⢋⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡌⠀⠀⠀⠀
        ⠀⠀⠀⠀⠀⠀⢹⣒⢭⣛⡻⠿⠿⠿⢟⣓⣢⣶⣿⡿⢟⣫⣼⣿⣿⣿⣿⣿⢹⢻⣾⠿⢻⣿⣿⡄⠀⠀⠀
        ⠀⠀⠀⠀⠀⠀⠸⣿⢿⡶⣾⣭⡽⣏⣭⣭⣭⣶⣷⣾⣪⣿⣿⣱⢿⣿⣿⣿⢰⡫⡞⠀⠘⣿⣿⣧⠀⠀⠀
        ⠀⠀⠀⠀⠀⠀⠈⢱⣿⡇⣿⣿⣷⣮⡝⠛⠿⢿⣿⣗⣽⡷⣸⣿⣿⣿⣿⠟⣾⣿⣄⣀⣀⣿⣿⡟⠀⠀⠀
        ⠀⠀⠀⠀⠀⠀⠀⠀⣯⣶⣿⣿⣿⡟⠁⠀⠀⠒⠶⡈⠉⢑⣿⣿⣿⣿⠋⠂⢻⣿⣿⣿⣿⣿⣿⠃⠀⠀⠀
        ⠀⠀⠀⠀⠀⠀⠀⠀⠺⠟⠻⡝⠋⠀⠀⠀⠀⠀⠀⣻⢾⢿⢿⢿⠟⠁⠀⠀⠀⠝⠫⠝⢟⠻⠁⠀⠀⠀⠀
        ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠁⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀`;
  }
}

module.exports = {
  Bulbasaur,
};
