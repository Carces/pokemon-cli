const { Player } = require("../trainers/player");

class PlayerData {
    constructor(name, starter) {
        this.player = new Player(name, [starter])
    }
}

module.exports = { PlayerData }