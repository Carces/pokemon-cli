const { Fire } = require('../types/fire');
const { movesData } = require('../../main-game/data/moves-data.js');

class Charmander extends Fire {
  constructor(
    name = 'Charmander',
    level,
    moves = ['Scratch', 'Growl'],
    hitPoints,
    attack,
    defence,
    catchDifficulty = 6
  ) {
    super(name, level, moves, hitPoints, attack, defence, catchDifficulty);
    this.species = 'Charmander';
    this.moveTable = {
      level3: ['Ember'],
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
        ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣠⣤⣶⣶⣶⣤⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
        ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⣾⣿⣿⣿⣿⣿⣿⣿⣿⣷⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
        ⠀⠀⠀⠀⠀⠀⠀⠀⠀⣰⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡟⠿⡆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
        ⠀⠀⠀⠀⠀⠀⠀⠀⠀⣙⣏⣿⣿⣿⣿⣿⣿⣿⣶⡏⣿⠀⢳⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
        ⠀⠀⠀⠀⠀⠀⠀⠀⢠⠻⢹⣿⣿⣿⣿⣿⣿⣿⣿⡇⠉⠀⠈⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
        ⠀⠀⠀⠀⠀⠀⠀⠀⡴⠀⣾⣿⣿⣿⣿⣿⣿⣿⣿⣇⠀⢀⣤⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
        ⠀⠀⠀⠀⠀⠀⠀⢀⣿⣷⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠿⢿⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
        ⠀⠀⠀⠀⠀⠀⠀⠀⠙⣍⠽⠻⠾⣿⡿⠿⠟⠛⠋⠉⠘⢀⣿⠇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
        ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠙⠦⣀⡀⢀⣴⣶⣶⡿⢟⣰⣿⠏⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣶⢨⣾⡀⠀⠀⠀⠀⠀⠀
        ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀ ⣽⣶⣶⣶⣶⣿⣿⣿⣤⣤⣄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⣿⣿⣧⡀⠀⠀⠀⠀⠀
        ⠀⠀⠀⠀⠀⠀⠀⠀⢀⣀⣠⣴⣾⣿⣹⣋⣵⣶⣮⣿⣿⣿⣿⣿⣿⣿⣷⣦⣄⣄⣀⡄⠀⠀⠀⠀⢀⣼⣿⡿⢈⣿⡿⠂⠀⠀⠀⠀
        ⠀⠀⠀⠀⠀⠰⣶⣿⣿⣿⣿⣿⣿⡏⣽⣿⣿⣿⣿⣿⣮⢿⣿⣿⣿⣿⣿⣿⣿⡟⣿⣶⡂⠀⠀⢠⣾⣿⣿⣷⣾⣿⣧⡄⠀⠀⠀⠀
        ⠀⠀⠀⠀⠀⠀⠈⠿⣿⣿⣿⣿⠛⢱⣿⣿⣿⣿⣿⣿⣿⣷⡻⣛⡟⠛⢿⠿⠛⠋⠘⠉⠀⠀⠀⠀⠙⢿⣿⣿⣿⠏⠈⠁⠀⠀⠀⠀
        ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣽⣿⣷⣄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠻⠿⠿⠟⠀⠀⠀⠀⠀⠀
        ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡟⣿⣿⣿⣆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣾⡇⠀⠀⠀⠀⠀⠀⠀
        ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⢛⣿⣿⣿⣧⡀⠀⠀⠀⠀⠀⠀⠀  ⡟⠀⠀⠀⠀⠀⠀⠀⠀
        ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣰⣿⣿⣞⣿⣿⣿⣿⣿⣿⣿⣿⣿⣳⣿⣿⣿⣿⣿⣷⠀⠀⠀⠀⠀⠀⠀ ⡴⠀⠀⠀⠀⠀⠀⠀⠀⠀
        ⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⣿⣿⣿⣝⢿⣿⣿⣿⣿⣿⣿⣿⣻⣿⣿⣿⣿⣿⣿⣇⠀⠀⠀⠀⠀⠀⡴⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
        ⠀⠀⠀⠀⠀⠀⠀⠀⠀⢺⣿⣿⣿⣿⣿⣷⣍⣛⠿⣿⣿⣿⣿⡛⣿⣿⣿⣿⣿⣿⣿⠀⠀⣀⣠⠶⠊⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
        ⠀⠀⠀⠀⠀⠀⠀⠀⠀⢈⠻⣿⣿⣿⣿⡟⠉⠁⠀⠀⠈⠉⠉⠁⠈⠻⣿⣿⣿⣿⣿⡎⠙⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
        ⠀⠀⠀⠀⠀⠀⠀⠠⣮⣿⣦⡙⠟⠛⠉⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢹⣿⣿⣿⡿⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
        ⠀⠀⠀⠀⠀⠀⠀⠀⠀  ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠑⠮⡚⠳⡍⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀`;
  }
}

module.exports = {
  Charmander,
};
