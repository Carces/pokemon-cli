const {
    Pokemon,
 } = require('../pokemon.js')


describe('pokemon class', () => {
    
    describe('constructor funtion', () => {
        test('should give created pokemon name, type, hitPoints, attackDamage and move properties', () => {
            const fred = new Pokemon('Fred', 10, 10);
            
            expect(fred.hasOwnProperty('name')).toBe(true)
            expect(fred.hasOwnProperty('type')).toBe(true)
            expect(fred.hasOwnProperty('hitPoints')).toBe(true)
            expect(fred.hasOwnProperty('attackDamage')).toBe(true)
            expect(fred.hasOwnProperty('move')).toBe(true)
        })

        test('if not specified, type should have a default value of normal, and move should have a default value of tackle', () => {
            const fred = new Pokemon('Fred', 10, 10);
            
            expect(fred.type).toBe('normal')
            expect(fred.move).toBe('tackle')

        })
    })

    describe('methods', () => {
        describe('isEffectiveAgainst()', () => {
            test('returns true when the pokemon the method is called on has a type that is effective against the pokemon passed as an argument', () => {
                const bill = new Pokemon('Bill',10,10,'fire')
                const ted = new Pokemon('Ted',10,10,'water')
                const brian = new Pokemon('Brian',10,10)

                expect(bill.isEffectiveAgainst(ted)).toBe(false)
                expect(ted.isEffectiveAgainst(bill)).toBe(true)
                expect(brian.isEffectiveAgainst(bill)).toBe(false)
            })
        })

        describe('isWeakTo()', () => {
            test('returns true when the pokemon the method is called on has a type that is weak against the pokemon passed as an argument', () => {
                const bill = new Pokemon('Bill',10,10,'fire')
                const ted = new Pokemon('Ted',10,10,'water')
                const brian = new Pokemon('Brian',10,10)

                expect(bill.isWeakTo(ted)).toBe(true)
                expect(ted.isWeakTo(bill)).toBe(false)
                expect(brian.isWeakTo(bill)).toBe(false)
            })
        })

        describe('takeDamage()', () => {
            test('when called with a number, reduces the health of the pokemon takeDamage was called on by number passed as argument', () => {
                const bill = new Pokemon('Bill',10,10,'fire')

                bill.takeDamage(5)

                expect(bill.health).toBe(5)

            })

            test('does not reduce health below 0', () => {
                const bill = new Pokemon('Bill',10,10,'fire')

                bill.takeDamage(12)

                expect(bill.health).toBe(0)
            })
        })

        describe('useMove()', () => {
            test('returns the attackDamage property of the pokemon the method is called on', () => {
                const bill = new Pokemon('Bill',10,10,'fire')

                expect(bill.useMove()).toBe(10)

            })

            test('logs "<name> used <move>!" to the console', () => {
                const bill = new Pokemon('Bill',10,10,'fire')
                const consoleSpy = jest.spyOn(console, 'log')

                bill.useMove()

                expect(consoleSpy).toHaveBeenCalledTimes(1)
                expect(consoleSpy).toHaveBeenCalledWith('Bill used tackle!')

                consoleSpy.mockRestore()
            })
        })
        
        describe('hasFainted()', () => {
            test('returns true if health is 0, otherwise returns false', () => {
                const bill = new Pokemon('Bill',10,10,'fire')

                expect(bill.hasFainted()).toBe(false)

                bill.takeDamage(20)

                expect(bill.hasFainted()).toBe(true)

            })
        })
    })
})