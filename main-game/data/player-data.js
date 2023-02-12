const { Player } = require("../trainers/player");

class PlayerData {
    constructor(name, starter) {
        this.player = new Player(name, [starter])
        this.computer = [
            
        ]
    }
}

module.exports = { PlayerData }