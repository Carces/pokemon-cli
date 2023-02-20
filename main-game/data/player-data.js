const { Player } = require('../trainers/player');

class PlayerData {
  constructor(name, starter) {
    this.progressLevel = 0;
    this.townsVisited = [];
    this.player = new Player(name, [starter]);
    this.computer = [];
  }
}

module.exports = { PlayerData };
