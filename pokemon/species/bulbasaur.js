const { Grass } = require('../types/grass');
const { movesData } = require('../../main-game/data/moves-data.js');

class Bulbasaur extends Grass {
  constructor(
    name = 'Bulbasaur',
    level,
    moves = ['Tackle', 'Growl'],
    hitPoints = 11 + level * 2,
    attack = 12 + level * 2,
    defence = 12 + level * 2,
    speed = 11 + level * 2,
    accuracy = 100,
    catchDifficulty = 6,
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
    this.species = 'Bulbasaur';
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
  static moveTable = {
    level3: ['Vine Whip'],
  };
}

module.exports = {
  Bulbasaur,
};
