SOLVE DAMAGE FORUMLA BALANCE:
currently, attack affects damage much more than defence. This means that moves that lower attack by one stage are much more effective than moves that lower defence by one stage, and after just a few uses of growl, pokemon start to deal minimum damage, even with a limiter that stats can't be reduced past half of their normal value.
This is because if the damage formula in pokemon.js>useMove(), which mutliplies attack by a random number (average of ~1.85), then subtracts defence from the total. This ensures that damage numbers scale with level, keeping up with scaling hit points, but it means that attack is almost twice as significant in the damage calculation as defence is.
Experimented with alternative formula: random + attack - defence. This results in equal weighting for attack and defence, but for the average pokemon where their attack and defence stats are equal, they cancel each other out, meaning the only damage dealt is the ~1.85 points added by random. This damage won't scale with level, so won't keep up with scaling hitpoints.
The perfect formula will:
- give attack and defence equal weighting, and make attack-reducing and defence-reducing moves have a roughly equal effect on damage numbers
- steadily increase damage as pokemon level up, in line with hitpoints (around 1.75 more per level)
- maintain a roughly similar level of randomness to the current one

catchDifficulty default should be set per species, as well as pokemon.js setting the overall default of 5. It should also be moved to the end of species constructor params as it will almost always just be the species default.
at 1/4 health with a normal Poke Ball, catch ranges from ~4-11

trainer resolveItem method currently only works correctly when using items in battle. for items used outside of battle, 

load-game needs to be completed:
 BEFORE THE FOR EACH LOOP, create a new Player without arguments (should therefore have no balls). 
 
 within the loop, use species-data and newPokemon to create new instances of each ball's storage-held pokemon, passing in name, level, moves, hp, atk, def to the constructor from the stored data. Then, create a new pokeball, [may need balls-data like species-data to export all classes of ball], passing its constructor ballType object and price. Finally, manually set the ball's storage to the newly-created pokemon and belt[i] to that pokeball

non-damaging moves have effects but they aren't currently applied - now that attack and defence are objects with current and max should be easy

make use of doesDamage property on moves - non-damaging moves still follow the same logic and console.logs in fight() - can have a log saying it was a critical, damage still mentioned etc.

implement pokemon speed stat and move priority (e.g. quick attack)

implement special/physical attacks

implement evasion - in-game, accuracy and speed always start at 100 and attacks always hit until evasion or accuracy are increased/decreased

restructuring battle to avoid deeply nested then blocks - can checkIfBattleOver be refactored to only need calling once? It would help the nesting situation in resolveTurn if so

implement logic to run option - should only work on wild pokemon. previously had the idea to create a 'wild pokemon' class that can function as a trainer in a battle. However, so many things rely on currentPokeball, checking/setting pokeballs, that it might be a lot of work
