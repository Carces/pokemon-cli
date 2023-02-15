Bring battle loop in line with games: currently, player always goes first (pending implementation of pokemon speed). Currently, switching out unconscious pokemon is handled by resolveTurn() calling checkIfBattleOver once for each trainer. If player pokemon damages itself, checkIfBattleOver(player) will call choosePokemon. Immediately after that, checkIfBattleOver(opponent) will call choosePokemon if they have remaining pokemon. That promise chain gets resolved and returned to resolveTurn(). Opponent then goes straight to selecting a random move and using it with fight()
In the games, when a pokemon is downed, that round ends.
The trainer whose pokemon was downed immediately chooses a pokemon to bring out. The games have two modes, shift (where the player now gets to choose to change pokemon as a free action) and set (where they have to use their turn to switch if they want to do so)
The next round now begins. If the player had higher speed than the downed pokemon, acted first last round and downed the opponent before they could attack, and their pokemon also has higher speed than the replacement pokemon sent out, they can act twice in a row.
It seems that if the player pokemon is slower and acts second, this won't be the case, as the round fully ends (? unconfirmed)

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
