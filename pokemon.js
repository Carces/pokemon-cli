class Pokemon {
    constructor(name, hitPoints, attackDamage, type = 'normal', move = 'tackle') {
        this.name = name;
        this.hitPoints = hitPoints;
        this.health = hitPoints;
        this.attackDamage = attackDamage;
        this.type = type;
        this.move = move;
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

    useMove() {
        console.log(`${this.name} used ${this.move}!`)
        return this.attackDamage
    }

    hasFainted() {
        return this.health === 0
    }
}

module.exports = {
    Pokemon,
}