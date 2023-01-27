const { Battle } = require("../battle.js");
const { Trainer } = require("../trainer.js");
const { Pokemon } = require("../pokemon.js");
const { Bulbasaur } = require("../species/bulbasaur");
const { Charmander } = require("../species/charmander");
const { Squirtle } = require("../species/squirtle");
const { Rattata } = require("../species/rattata");

describe("battle", () => {
  test("getCriticalHit returns 0 or 1", () => {
    const battle = new Battle();
    const hits = [];
    let i = 0;
    while (i < 10) {
      hits.push(battle.getCriticalHit());
      i++;
    }
    expect(hits.every((hit) => hit === 1 || hit === 0)).toBe(true);
  });

  describe("battleOver method", () => {
    test("Battle property battleOver is false after calling checkIfBattleOver() if both trainers have pokemon in their belt with health left", () => {
      const jeb = new Trainer("Jebediah");
      const butch = new Trainer("Butch");
      const margaret = new Bulbasaur("Margaret", 10, 10);
      const david = new Rattata("David", 10, 10);
      const gareth = new Charmander("Gareth", 10, 10);
      gareth.health = 0;
      const garibald = new Squirtle("Garibald", 10, 10);
      garibald.health = 0;
      jeb.belt[0].storage = gareth;
      butch.belt[1].storage = garibald;
      jeb.belt[1].storage = margaret;
      butch.belt[3].storage = david;
      const battle = new Battle(jeb, butch);
      battle.setCurrentPokeballs();
      battle.checkIfBattleOver();
      expect(battle.battleOver).toBe(false);
    });
    test("Battle property battleOver is true after calling checkIfBattleOver() if neither trainers have any pokemon in their belt with health left", () => {
      const jeb = new Trainer("Jebediah");
      const butch = new Trainer("Butch");
      const gareth = new Charmander("Gareth", 10, 10);
      const garibald = new Squirtle("Garibald", 10, 10);
      jeb.belt[0].storage = gareth;
      butch.belt[1].storage = garibald;
      const battle = new Battle(jeb, butch);
      battle.setCurrentPokeballs();
      gareth.health = 0;
      garibald.health = 0;
      battle.checkIfBattleOver();
      expect(battle.battleOver).toBe(true);
    });
    test("Battle property battleOver is true after calling checkIfBattleOver() if the first trainer has no pokemon in their belt with health left", () => {
      const jeb = new Trainer("Jebediah");
      const butch = new Trainer("Butch");
      const gareth = new Charmander("Gareth", 10, 10);
      const garibald = new Squirtle("Garibald", 10, 10);
      jeb.belt[0].storage = gareth;
      butch.belt[1].storage = garibald;
      const battle = new Battle(jeb, butch);
      battle.setCurrentPokeballs();
      gareth.health = 0;
      battle.checkIfBattleOver();
      expect(battle.battleOver).toBe(true);
    });
    test("Battle property battleOver is true after calling checkIfBattleOver() if the first trainer has no pokemon in their belt with health left", () => {
      const jeb = new Trainer("Jebediah");
      const butch = new Trainer("Butch");
      const gareth = new Charmander("Gareth", 10, 10);
      const garibald = new Squirtle("Garibald", 10, 10);
      jeb.belt[0].storage = gareth;
      butch.belt[1].storage = garibald;
      const battle = new Battle(jeb, butch);
      battle.setCurrentPokeballs();
      garibald.health = 0;
      battle.checkIfBattleOver();
      expect(battle.battleOver).toBe(true);
    });
  });
  describe("setCurrentPokeballs", () => {
    test("When called with no parameters and both trainers have non-fainted pokemon in their first belt slots, each trainers current pokeballs are set to their first pokeballs", () => {
      const jeb = new Trainer("Jebediah");
      const butch = new Trainer("Butch");
      const gareth = new Charmander("Gareth", 10, 10);
      const garibald = new Squirtle("Garibald", 10, 10);
      jeb.belt[0].storage = gareth;
      butch.belt[0].storage = garibald;
      const battle = new Battle(jeb, butch);
      battle.setCurrentPokeballs();
      expect(jeb.currentPokeball).toBe(jeb.belt[0]);
      expect(butch.currentPokeball).toBe(butch.belt[0]);
    });
    test("When called with no parameters and both trainers have non-fainted pokemon in any belt slot, each trainers current pokeballs are set to their first non-fainted pokemon", () => {
        const jeb = new Trainer("Jebediah");
        const butch = new Trainer("Butch");
        const gareth = new Charmander("Gareth", 10, 10);
        const garibald = new Squirtle("Garibald", 10, 10);
        const gertrude = new Bulbasaur("Gertrude", 10, 10)
        const winfred = new Charmander("Winfred", 10, 10);
        const clarissa = new Bulbasaur("Clarissa", 10, 10);
        jeb.belt[0].storage = gareth;
        jeb.belt[2].storage = gertrude;
        butch.belt[0].storage = garibald;
        butch.belt[4].storage = winfred;
        butch.belt[5].storage = clarissa;
        gareth.health = 0;
        garibald.health = 0;
        const battle = new Battle(jeb, butch);
        battle.setCurrentPokeballs();
        expect(jeb.currentPokeball).toBe(jeb.belt[2]);
        expect(butch.currentPokeball).toBe(butch.belt[4]);
      });
    test("When called with one parameter, that trainer's current pokeball is set to the first valid pokeball in their belt, and the second trainer's current pokeball is not changed", () => {
        const jeb = new Trainer("Jebediah");
        const butch = new Trainer("Butch");
        const gareth = new Charmander("Gareth", 10, 10);
        const garibald = new Squirtle("Garibald", 10, 10);
        const gertrude = new Bulbasaur("Gertrude", 10, 10)
        const winfred = new Charmander("Winfred", 10, 10);
        const clarissa = new Bulbasaur("Clarissa", 10, 10);
        jeb.belt[0].storage = gareth;
        jeb.belt[2].storage = gertrude;
        butch.belt[0].storage = garibald;
        butch.belt[4].storage = winfred;
        butch.belt[5].storage = clarissa;
        gareth.health = 0;
        garibald.health = 0;
        const battle = new Battle(jeb, butch);
        butch.currentPokeball = butch.belt[1];
        battle.setCurrentPokeballs(jeb);
        expect(jeb.currentPokeball).toBe(jeb.belt[2]);
        expect(butch.currentPokeball).toBe(butch.belt[1]);
    })
  });
});
