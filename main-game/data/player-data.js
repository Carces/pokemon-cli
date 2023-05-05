const { Player } = require('../trainers/player');

class PlayerData {
  constructor(name, starter, ...pokemon) {
    this.progressLevel = 0;
    this.townsVisited = [];
    this.player = new Player(name, [starter, ...pokemon]);
    this.PC = [];
  }
}

module.exports = { PlayerData };
