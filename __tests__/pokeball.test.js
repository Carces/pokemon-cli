const { Pokeball } = require('../pokeball.js');
const { Fire } = require('../types/fire.js');
const { Rattata } = require('../species/rattata.js')
const { Squirtle } = require('../species/squirtle.js')

describe('Pokeball', () => {
    test('New pokeball is an instance of pokeball', () => {
        const veryGoodBall = new Pokeball();
        expect(veryGoodBall instanceof Pokeball).toBe(true);
    })
    describe('Throw', () => {
        test('If ball is empty and no pokemon passed as an argument, the user is insulted', () => {
            const veryGoodBall = new Pokeball();
            const consoleSpy = jest.spyOn(console, 'log');
            veryGoodBall.throw();
            expect(consoleSpy).toHaveBeenCalledWith('Your ball is empty and you are a numpty.');Squirtle
            expect(consoleSpy).toHaveBeenCalledTimes(1);
            consoleSpy.mockRestore();
        })
        test('If ball is empty and a pokemon is passed as an argument, it should be added to the balls storage and log to console', () => {
            const veryGoodBall = new Pokeball();
            const cuthbert = new Rattata('Cuthbert', 10, 10);
            const consoleSpy = jest.spyOn(console, 'log');
            veryGoodBall.throw(cuthbert);
            expect(consoleSpy).toHaveBeenCalledWith('You caught Cuthbert!');
            expect(consoleSpy).toHaveBeenCalledTimes(1);
            consoleSpy.mockRestore();
            expect(veryGoodBall.storage).toBe(cuthbert);
        })
        test('If ball storage contains a pokemon and a pokemon is passed as an argument, warn the user and storage is not changed', () => {
            const veryGoodBall = new Pokeball();
            const engelbert = new Squirtle('Engelbert', 10, 10);
            const cuthbert = new Rattata('Cuthbert', 10, 10);
            veryGoodBall.storage = engelbert;
            const consoleSpy = jest.spyOn(console, 'log');
            veryGoodBall.throw(cuthbert);
            expect(consoleSpy).toHaveBeenCalledWith('There is already a pokemon in this ball!');
            expect(consoleSpy).toHaveBeenCalledTimes(1);
            consoleSpy.mockRestore();
            expect(veryGoodBall.storage).toBe(engelbert);
        })
        test('If ball storage contains a pokemon and the throw function is invoked with no parameters, return the pokemon and console log a battle cry', () => {
            const veryGoodBall = new Pokeball();
            const engelbert = new Squirtle('Engelbert', 10, 10);
            veryGoodBall.storage = engelbert;
            const consoleSpy = jest.spyOn(console, 'log');
            expect(veryGoodBall.throw()).toBe(engelbert);
            expect(consoleSpy).toHaveBeenCalledWith('Go, Engelbert!');
            expect(consoleSpy).toHaveBeenCalledTimes(1);
            consoleSpy.mockRestore();
        })
    })
    describe('isEmpty', () => {
        test('Returns a boolean representing whether the pokeball storage contains a pokemon', () => {
            const veryGoodBall = new Pokeball();
            expect(veryGoodBall.isEmpty()).toBe(true);
            const humphrey = new Rattata('Humphrey', 10, 10);
            veryGoodBall.storage = humphrey;
            expect(veryGoodBall.isEmpty()).toBe(false);
        })
    })
    describe('contains', () => {
        test('Should return the name of a stored pokemon', () => {
            const veryGoodBall = new Pokeball();
            const humphrey = new Rattata('Humphrey', 10, 10);
            veryGoodBall.storage = humphrey;
            expect(veryGoodBall.contains()).toBe('Humphrey');
        })
        test('Should return a warning if the pokeball is empty', () => {
            const veryGoodBall = new Pokeball();
            expect(veryGoodBall.contains()).toBe('empty ...');
        })
    })
})

