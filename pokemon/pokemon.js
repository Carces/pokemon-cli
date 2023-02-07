class Pokemon {
    constructor(name, level = 1, type = 'normal', move = 'tackle', catchDifficulty = 5, hitPoints = level*7.5, attack = level*5, defence = level*5 ) {
        this.name = name;
        this.level = level
        this.type = type;
        this.move = move;
        this.catchDifficulty = catchDifficulty;
        this.hitPoints = hitPoints;
        this.health = hitPoints;
        this.attack = attack;
        this.defence = defence;
    }

    isEffectiveAgainst(otherPokemon) {
        const strengths = {
            fire: 'grass',
            grass: 'water',
            water: 'fire'
        }

        return strengths[this.type] === otherPokemon.type
    }


    isWeakTo(otherPokemon) {
        const weaknesses = {
            grass: 'fire',
            water: 'grass',
            fire: 'water'
        }

        return weaknesses[this.type] === otherPokemon.type
    }

    takeDamage(damage) {
        this.health = Math.max(0, this.health - damage)
    }

    useMove(target) {
        const random = (Math.random() * -0.3) + 1.5
        const damage = (random * this.attack) - target.defence
        console.log(`${this.name} used ${this.move}!`)
        return damage.toFixed(2)
    }

    hasFainted() {
        return this.health === 0
    }
}

module.exports = {
    Pokemon,
}