class PlayerData {
    #player;
    #name;
    constructor() {
    }

    set player(player) {
        this.#player = player;
    }

    get player() {
        return this.#player;
    }

    set name(name) {
        this.#name = name;
    }

    get name() {
        return this.#name;
    }
}

module.exports = { PlayerData }