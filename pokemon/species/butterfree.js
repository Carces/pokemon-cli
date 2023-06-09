const { Pokemon } = require('../pokemon.js');

class Butterfree extends Pokemon {
  constructor(
    name = 'Butterfree',
    level,
    moves = ['Confusion'],
    hitPoints = 14 + level * 4,
    attack = 11 + level * 2,
    defence = 12 + level * 2,
    spAttack = 18 + level * 2,
    spDefence = 18 + level * 2,
    speed = 16 + level * 2,
    accuracy = 100,
    catchDifficulty = 7,
    isEvolving
  ) {
    super(
      name,
      level,
      ['bug', 'flying'],
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
    this.species = 'Butterfree';
    this.isEvolving = isEvolving;
    this.moveTable = {
      level10: ['Confusion'],
      level13: ['Poison Powder'],
      level14: ['Stun Spore'],
      level15: ['Sleep Powder'],
      level18: ['Supersonic'],
      level23: ['Whirlwind'],
      level28: ['Gust'],
    };
    this.generateMoves();
    this.art = `
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀  ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣠⣀⣀⡀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀  ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣤⣴⣿⣿⣿⣿⣿⣿⡆⠀⠀⠀⠀⠀⠀
⠀⠀⠀⢠⣶⣶⣶⣤⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⣴⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣻⣶⣦⣄⠀⠀⠀
⠀⠀⠀⢿⣿⣿⣿⣿⣿⣦⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣤⣾⣿⣿⣿⣿⣿⣿⣿⣿⣾⣿⣾⣿⣿⣿⣿⣿⡇⠀⠀
⠀⠀⣠⣿⣿⣿⣿⣿⣿⣿⣿⣆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣴⣿⡿⠿⢋⠉⡀⠈⠉⠋⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠇⠀⠀
⠀⠀⣿⣿⣿⣿⡟⠛⠛⠻⣿⣿⣧⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣴⣿⣿⣫⣶⣿⣿⣿⣿⣷⡄⠀⠈⣿⣿⣿⣛⣿⣿⣿⣿⣧⡀⠀⠀
⠀⠀⣻⣿⣿⣿⠀⣰⣾⣿⣶⣽⣿⢰⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡇⢀⣴⣾⣿⣿⣿⣿⣿⣿⣿⣿⡇⠀⠀
⠀⠀⣿⣿⣿⣿⡇⢸⣿⣿⣿⣿⣯⡆⣷⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣰⣿⣯⣿⣿⣿⣿⣿⣿⣿⣿⣿⣫⣶⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠟⠀⠀⠀
⠀⠀⠘⣻⣿⡿⣿⣶⣻⣿⣿⣿⣿⣿⣹⣷⠀⠀⠀⠀⠀⠀⠀⠀⠀⣼⣿⣳⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣟⣻⣿⣿⣿⣿⣟⠋⠁⠀⠀⠀⠀
⠀⠀⠀⣿⣿⣿⣷⣿⣿⣾⡿⣿⣿⣿⢟⢫⣷⣶⡇⣿⣻⢶⣤⣀⢰⣿⣿⣿⣿⣿⣿⣿⢽⣿⣯⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣧⠀⠀⠀⠀⠀
⠀⠀⠀⠸⣿⣿⣿⣿⣿⣿⣿⣿⡿⣵⣿⣿⣿⣿⣷⣿⢱⣿⣷⣶⣝⠼⣿⣿⣟⣽⣽⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠹⢿⣿⣿⣿⣿⣿⣟⣿⣿⣎⢿⣿⣿⣿⣿⢹⣿⣿⣿⣿⡯⢼⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠋⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⢸⣿⣿⣿⣿⣿⣿⣿⣿⣿⡞⣿⡿⢿⡿⢇⠻⣿⣿⣿⡇⢟⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠟⠁⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⣿⣿⣿⣿⣿⣿⣿⣿⣿⢹⢫⣾⣿⣿⢇⣷⣬⣉⣋⢡⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣦⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠈⣿⣿⣿⣿⣿⣮⣛⢥⣿⣧⣫⣭⣷⣾⣿⡿⣛⣥⣭⢿⣟⣿⣿⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠹⣿⣿⣿⣿⣿⣿⣿⣷⣯⣽⣿⣿⣿⣿⣟⢯⣝⢻⣷⣟⣿⣿⣿⣿⣿⣽⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠟⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠈⢹⣿⣿⣿⣿⣿⣿⣿⣯⣺⣿⣿⣿⣯⣞⣿⣻⣟⣿⢺⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⣿⣿⣛⡿⠿⠟⠁⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠹⢿⣿⣿⣿⣿⣯⣻⣺⣿⣿⣿⣿⣶⣾⣿⣿⢟⣾⣷⣿⣿⡿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠉⠙⠋⣽⣟⣿⣽⡻⡿⢿⣿⠿⠟⢩⣶⡭⣿⣿⣿⣿⣿⣮⡽⣿⣟⣻⠛⠛⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢿⣿⣿⣿⣿⢿⣸⣿⡦⠀⢸⣿⣿⡝⣿⣿⢿⣿⣿⣗⣾⣿⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⢿⣯⢹⣿⣿⢸⣿⣿⡄⠸⣿⣿⣿⣻⣿⣾⣿⣦⣿⣿⣿⣿⠇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠻⣿⣿⣿⡿⣿⣿⣧⠈⢻⣿⣿⣧⠙⠻⣿⣿⣿⣿⡿⠋⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠉⠁⠹⣿⣿⠀⠈⠻⣿⡿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠉⠀⠀⠀⠈⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀`;
  }
}

module.exports = {
  Butterfree,
};
