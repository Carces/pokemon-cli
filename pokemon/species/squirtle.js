const { Water } = require('../types/water');
const { movesData } = require('../../main-game/data/moves-data.js');

class Squirtle extends Water {
  constructor(
    name = 'Squirtle',
    level,
    moves = ['Tackle', 'Tail Whip'],
    hitPoints = 10 + level * 2,
    attack = 12 + level * 2,
    defence = 15 + level * 2,
    speed = 10 + level * 2,
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
      catchDifficulty
    );
    this.species = 'Squirtle';
    this.isEvolving = isEvolving;
    this.moveTable = {
      level3: ['Water Gun'],
    };
    this.generateMoves();
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
