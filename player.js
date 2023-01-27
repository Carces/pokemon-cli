class Player extends Trainer {
    constructor(name, ...pokemon) {
        super(name, ...pokemon);
        this.isPlayer = true;
    }
}