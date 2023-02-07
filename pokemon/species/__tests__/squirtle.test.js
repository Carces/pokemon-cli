const { Squirtle } = require('../squirtle')

const { Water } = require('../../types/water')

describe('Squirtle', () => {
    test('Should be an instance of the Water class', () => {
        const godric = new Squirtle('Godric', 10, 10)

        expect(godric instanceof Water).toBe(true)
    })

    test('Move should be "water gun"', () => {
        const godric = new Squirtle('Godric', 10, 10)

        expect(godric.move).toBe('water gun')
    })
})