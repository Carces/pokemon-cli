const { Rattata } = require('../rattata')

const { Pokemon } = require('../../pokemon')

describe('Rattata', () => {
    test('Should be an instance of the Pokemon class', () => {
        const ralph = new Rattata('Ralph', 10, 10)

        expect(ralph instanceof Pokemon).toBe(true)
    })
})