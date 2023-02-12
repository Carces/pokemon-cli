class Pokemon {
    constructor(
        name, 
        level = 1,
        type = 'normal', 
        moves = [tackle], 
        catchDifficulty = 5, 
        hitPoints = 20 + (level * 1.25), 
        attack = 10 + (level * 0.75), 
        defence = 10 + (level * 0.75)
    ) {
            this.name = name;
            this.level = level
            this.type = type;
            this.moves = moves;
            this.catchDifficulty = catchDifficulty;
            this.hitPoints = {current: hitPoints, max: hitPoints};
            this.attack = {current: attack, max: attack};
            this.defence = {current: defence, max: defence};
            this.xp = this.level ** 2
            this.xpThreshold = Math.floor((this.level + 1) ** 2.5)
            this.activeEffects = {}
    }

    isResistantTo(move) {
        const strengths = {
            fire: 'grass',
            grass: 'water',
            water: 'fire'
        }
        return strengths[this.type] === move.type
    }

    isWeakTo(move) {
        const weaknesses = {
            grass: 'fire',
            water: 'grass',
            fire: 'water'
        }
        return weaknesses[this.type] === move.type
    }

    takeDamage(damage) {
        this.hitPoints.current = Math.max(0, +(this.hitPoints.current - damage).toFixed(2))
    }

    useMove(move, target) {
        console.log(`${this.name} used ${move.name}!`)
        
        if (move.doesDamage) {
            const random = (Math.random() * -0.3) + 2
            const damage = ((random * this.attack.current) - target.defence.current) * move.damageMultiplier
            const damageToReturn = Math.max(1, +damage.toFixed(2))
            return damageToReturn
        }
    }

    addXp(num) {
        this.xp += num;
        if (this.xp >= this.xpThreshold) {
            this.level++
            this.hitPoints.max += 1.25
            this.hitPoints.current += 1.25
            this.attack.max += 0.75
            this.attack.current += 0.75
            this.defence.max += 0.75
            this.defence.current += 0.75
            this.xpThreshold = Math.floor((this.level + 1) ** 2.5)
            console.log(`${this.name} grew to level ${this.level}!`)
        }
    }

    hasFainted() {
        return this.hitPoints.current === 0
    }
}

module.exports = {
    Pokemon,
}