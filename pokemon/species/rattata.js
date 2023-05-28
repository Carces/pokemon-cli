const { Normal } = require('../../pokemon/types/normal.js');
const { movesData } = require('../../main-game/data/moves-data.js');

class Rattata extends Normal {
  constructor(
    name = 'Rattata',
    level,
    moves = ['Tackle', 'Tail Whip'],
    hitPoints = 8 + level * 2,
    attack = 13 + level * 2,
    defence = 9 + level * 2,
    speed = 16 + level * 2,
    accuracy = 100,
    catchDifficulty = 2,
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
      catchDifficulty
    );
    this.species = 'Rattata';
    this.isEvolving = isEvolving;
    this.moveTable = {
      level4: ['Quick Attack'],
    };
    this.generateMoves();
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
