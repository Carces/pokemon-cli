const { Pokemon } = require('../pokemon');
const { movesData } = require('../../main-game/data/moves-data.js');

class Squirtle extends Pokemon {
  constructor(
    name = 'Squirtle',
    level,
    moves = ['Tackle', 'Tail Whip'],
    hitPoints = 11 + level * 4,
    attack = 12 + level * 2,
    defence = 15 + level * 2,
    spAttack = 12 + level * 2,
    spDefence = 15 + level * 2,
    speed = 11 + level * 2,
    accuracy = 100,
    catchDifficulty = 6,
    isEvolving
  ) {
    super(
      name,
      level,
      ['water'],
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
