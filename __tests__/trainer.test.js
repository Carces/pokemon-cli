const { Trainer } = require('../trainer.js')
const { Pokeball } = require('../pokeball.js')
const { Bulbasaur } = require('../species/bulbasaur.js')

describe('Trainer', () => {
    describe('constructor', () => {
        test('Belt should contain 6 pokeballs', () => {
            const harold = new Trainer('Harold')
    
            expect(harold.belt.length).toBe(6)
            expect(harold.belt[0] instanceof Pokeball).toBe(true)
        })
        test('Passing three pokemon as extra parameters after trainer name gives the trainer those pokemon', () => {
            const ivor = new Bulbasaur('Ivor', 10, 10);
            const ingrid = new Bulbasaur('Ingrid', 10, 10);
            const ingmar = new Bulbasaur('Ingmar', 10, 10);
            const igor = new Trainer('Igor', ivor, ingrid, ingmar);
            expect(igor.getPokemon('Ivor')).toBe(ivor);
            expect(igor.getPokemon('Ingrid')).toBe(ingrid);
            expect(igor.getPokemon('Ingmar')).toBe(ingmar);
        })
    })

    describe('catch method', () => {
        test('If trainer belt has at least one empty pokeball, add the pokemon passed as an argument to the first empty pokeball', () => {
            const harold = new Trainer('Harold')
            const jemima = new Bulbasaur('Jemima',10,10)

            harold.catch(jemima)
    
            expect(harold.belt[0].storage).toBe(jemima)
        })

        test('If trainer belt has no empty pokeballs, console log a warning', () => {
            const harold = new Trainer('Harold')
            const jemima = new Bulbasaur('Jemima',10,10)
            const consoleSpy = jest.spyOn(console, 'log')

            let i = 0;
            while (i < 6) {
                harold.belt[i].storage = new Bulbasaur(`Bulby ${i}`,10,10)
                i++
            }
            harold.catch(jemima)
    
            expect(consoleSpy).toHaveBeenCalledWith('Harold has no empty balls, Jemima ran away!')
            consoleSpy.mockRestore()
        })
    })

    describe('getPokemon method', () => {
        test('If belt has a pokeball containing the pokemon passed as an argument, throw that pokeball', () => {
            const harold = new Trainer('Harold')
            const jemima = new Bulbasaur('Jemima',10,10)
            const consoleSpy = jest.spyOn(console, 'log')

            harold.belt[0].storage = jemima
    
            expect(harold.getPokemon('Jemima')).toBe(jemima)
            expect(consoleSpy).toHaveBeenCalledWith('Go, Jemima!')
            consoleSpy.mockRestore()
        })

        test('If belt has no pokeball containing the pokemon passed as an argument, console.log a warning', () => {
            const harold = new Trainer('Harold')
            const jemima = new Bulbasaur('Jemima',10,10)
            const consoleSpy = jest.spyOn(console, 'log')

            harold.getPokemon('Jemima')
    
            expect(consoleSpy).toHaveBeenCalledWith("Harold doesn't have a pokemon called Jemima")
            consoleSpy.mockRestore()
        })
    })
})