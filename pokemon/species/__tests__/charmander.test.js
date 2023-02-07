const { Charmander } = require('../charmander')

const { Fire } = require('../../types/fire')

describe('Charmander', () => {
    test('Should be an instance of the Fire class', () => {
        const alberto = new Charmander('Alberto', 10, 10)

        expect(alberto instanceof Fire).toBe(true)
    })

    test('Move should be "ember"', () => {
        const alberto = new Charmander('Alberto', 10, 10)

        expect(alberto.move).toBe('ember')
    })
})