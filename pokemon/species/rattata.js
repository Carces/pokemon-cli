const { Pokemon } = require('../pokemon');
const { movesData } = require('../../main-game/data/moves-data.js');

class Rattata extends Pokemon {
  constructor(
    name = 'Rattata',
    level,
    moves = ['Tackle', 'Tail Whip'],
    hitPoints = 8 + level * 4,
    attack = 13 + level * 2,
    defence = 9 + level * 2,
    spAttack = 7 + level * 2,
    spDefence = 9 + level * 2,
    speed = 16 + level * 2,
    accuracy = 100,
    catchDifficulty = 2,
    isEvolving
  ) {
    super(
      name,
      level,
      ['normal'],
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
