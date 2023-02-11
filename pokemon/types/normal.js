const { Pokemon } = require('../pokemon.js')

class Normal extends Pokemon {
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
            super(name, level, 'normal', moves, catchDifficulty, hitPoints, attack, defence)
        }
}

module.exports = { Normal, }