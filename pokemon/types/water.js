const { Pokemon } = require('../pokemon.js')

class Water extends Pokemon {
    constructor(
        name, 
        level,
        moves, 
        catchDifficulty, 
        hitPoints, 
        attack, 
        defence,
                ) 
        {
            super(name, level, 'water', moves, catchDifficulty, hitPoints, attack, defence)
        }
}

module.exports = {Water, }