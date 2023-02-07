const {Fire} = require('../fire.js')
const {Grass} = require('../grass.js')
const {Water} = require('../water.js')
const {Pokemon} = require('../../pokemon.js')

describe('fire', () => {
    test('Class extends Pokemon', () => {
        expect(Object.getPrototypeOf(Fire)).toEqual(Pokemon)
    })
    test('Fire is weak to water only', () => {
        const lawrence = new Fire('Lawrence', 10, 10)
        const benjamin = new Pokemon('Benjamin', 10, 10, 'water')
        const elisha = new Pokemon('Elisha', 10, 10, 'grass')
        expect(lawrence.isWeakTo(benjamin)).toEqual(true)
        expect(lawrence.isWeakTo(elisha)).toEqual(false)

    })
    test('Class is effective against grass only', () => {
        const lawrence = new Fire('Lawrence', 10, 10)
        const benjamin = new Pokemon('Benjamin', 10, 10, 'water')
        const elisha = new Pokemon('Elisha', 10, 10, 'grass')
        expect(lawrence.isEffectiveAgainst(benjamin)).toEqual(false)
        expect(lawrence.isEffectiveAgainst(elisha)).toEqual(true)
    })
})

describe('grass', () => {
    test('Class extends Pokemon', () => {
        expect(Object.getPrototypeOf(Grass)).toEqual(Pokemon)
    })
    test('Grass is weak to fire only', () => {
        const lawrence = new Grass('Lawrence', 10, 10)
        const benjamin = new Pokemon('Benjamin', 10, 10, 'fire')
        const elisha = new Pokemon('Elisha', 10, 10, 'grass')
        expect(lawrence.isWeakTo(benjamin)).toEqual(true)
        expect(lawrence.isWeakTo(elisha)).toEqual(false)

    })
    test('Grass is effective against water only', () => {
        const lawrence = new Grass('Lawrence', 10, 10)
        const benjamin = new Pokemon('Benjamin', 10, 10, 'water')
        const elisha = new Pokemon('Elisha', 10, 10, 'fire')
        expect(lawrence.isEffectiveAgainst(benjamin)).toEqual(true)
        expect(lawrence.isEffectiveAgainst(elisha)).toEqual(false)
    })

})

    describe('water', () => {
        test('Class extends Pokemon', () => {
            expect(Object.getPrototypeOf(Grass)).toEqual(Pokemon)
        })
        test('Water is weak to grass only', () => {
            const lawrence = new Water('Lawrence', 10, 10)
            const benjamin = new Pokemon('Benjamin', 10, 10, 'fire')
            const elisha = new Pokemon('Elisha', 10, 10, 'grass')
            expect(lawrence.isWeakTo(elisha)).toEqual(true)
            expect(lawrence.isWeakTo(benjamin)).toEqual(false)
    
        })
        test('Water is effective against fire only', () => {
            const lawrence = new Water('Lawrence', 10, 10)
            const benjamin = new Pokemon('Benjamin', 10, 10, 'fire')
            const elisha = new Pokemon('Elisha', 10, 10, 'grass')
            expect(lawrence.isEffectiveAgainst(benjamin)).toEqual(true)
            expect(lawrence.isEffectiveAgainst(elisha)).toEqual(false)
        })
})