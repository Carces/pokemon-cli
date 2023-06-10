const { Pokemon } = require('../pokemon');
const { movesData } = require('../../main-game/data/moves-data.js');

class Bulbasaur extends Pokemon {
  constructor(
    name = 'Bulbasaur',
    level,
    moves = ['Tackle', 'Growl'],
    hitPoints = 11 + level * 4,
    attack = 12 + level * 2,
    defence = 12 + level * 2,
    spAttack = 15 + level * 2,
    spDefence = 15 + level * 2,
    speed = 11 + level * 2,
    accuracy = 100,
    catchDifficulty = 6,
    isEvolving
  ) {
    super(
      name,
      level,
      ['grass', 'poison'],
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
    this.species = 'Bulbasaur';
    this.isEvolving = isEvolving;
    this.moveTable = {
      level3: ['Vine Whip'],
    };
    this.generateMoves();
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
