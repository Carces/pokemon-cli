issue with save data: currently saves as .js, stringifying and saving as JSON or compressing in some other way may be better, but pokeballs having an 'owner' property that references the trainer object they belong to creates a circular reference, which JSON can't convert. Owner property is necessary for pokeball throw method to be able to change its message depending on whether the owner is a wild pokemon or not. Could be solved with some restructuring e.g. moving the throw console.log outside of pokeball to where throw is called. A better solution may be implementing a lookup table like movesData where owners can be looked up by name or ID, and a reference to the owner object can be gained that way. Issue will need considering when implementing player inventory.

non-damaging moves have effects but they aren't currently applied - now that attack and defence are objects with current and max should be easy

make use of doesDamage property on moves - non-damaging moves still follow the same logic and console.logs in fight() - can have a log saying it was a critical, damage still mentioned etc.

implement pokemon speed stat and move priority (e.g. quick attack)

implement special/physical attacks

implement evasion - in-game, accuracy and speed always start at 100 and attacks always hit until evasion or accuracy are increased/decreased

restructuring battle to avoid deeply nested then blocks - can checkIfBattleOver be refactored to only need calling once? It would help the nesting situation in resolveTurn if so

implement logic to run option - should only work on wild pokemon. previously had the idea to create a 'wild pokemon' class that can function as a trainer in a battle. However, so many things rely on currentPokeball, checking/setting pokeballs, that it might be a lot of work
