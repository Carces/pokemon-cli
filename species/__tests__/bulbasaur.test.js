const { Bulbasaur } = require('../bulbasaur')

const { Grass } = require('../../types/grass')

describe('Bulbasaur', () => {
    test('Should be an instance of the Grass class', () => {
        const alberto = new Bulbasaur('Alberto', 10, 10)

        expect(alberto instanceof Grass).toBe(true)
    })

    test('Move should be "vine whip"', () => {
        const alberto = new Bulbasaur('Alberto', 10, 10)

        expect(alberto.move).toBe('vine whip')
    })
})