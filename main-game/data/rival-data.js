const { Trainer } = require("../trainers/trainer.js");

class RivalData {
    constructor(name, starter) {
        this.rival = new Trainer(name, [starter])
    }
}

module.exports = { RivalData }