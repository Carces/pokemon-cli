const { Pokemon } = require('../pokemon.js')

class Grass extends Pokemon {
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
            super(name, level, 'grass', moves, catchDifficulty, hitPoints, attack, defence)
        }
}

module.exports = {Grass, }