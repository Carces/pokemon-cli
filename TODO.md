Implement the main loop after first town: recursion? Have a separate file that is a function with a then block of battles then town. That function recursively calls itself, passing in updated player data each time

## SOLUTION FOR RECURSIVE GAME LOOP:

Assign each then block in game.js and game-loops.js an ID. For gameLoop the ID is stage+block(?)
When loading, each block in game.js passes through if not the intended stageToLoad e.g:
if (stageToLoad !== <block_ID>) return Promise.resolve()
Might need to account for position within a block. Town blocks can be restarted on load without any issues, but Conversation blocks and battle blocks might need to track if the save happened before or after. Maybe add a tag onto the stageToLoad ID e.g. stageToLoad = introBattle-before / stageToLoad = introBattle-after

After intro battles, NOW can visit first town and heal up (maybe a firstTown param on enter town so that events in the town can work differently e.g. console log telling you to go heal, try to leave without pokemon at full doesn't work etc.)
Finally, after that you face a couple more wild pokemon then an early trainer

Make better use of specialBattle prop of Battle - instead of just passing a unique battle name and having console logs everywhere that check the battle name, pass in an array of objects on specialBattle, where each object is a message with text: blabla and event: playerWinsBattle / battleStart etc.

Add secondary effects to damage moves: ember and thunder shock should have 10% chance of burning/paralyzing

visited towns system - best way is probably adding townsData to saveGame and loading it in with updates. current layout means they'll all always have visited: false

FINISH randomTrainer/pokemon - generate random moves based on level, account for typePreferences and typeExclusive (maybe reorganise species so they're group by type on the exports object of species-data, then have two getRandoms - one to choose type, where their preferences are added an additional time to the array chosen from to weight in their favour, and the other to choose species within that type)

antidote has been added to items-data, with type remove. its effect has a .remove property which specifies the condition it removes. implement this. Also added some misc items that should console log a message when used from the menu outside of battle, they have an effect.message property for this.

> Moves have a uses property - currently uses game values which are very high (30 for tackle). useMove needs to reduce this by 1 (currently the property is only in movesData, needs storing separately. Maybe an array of length 4 where each number represents the num of uses of the move in that slot? if so, will need to be refreshed when an old move is replaced with a new one on level up)

Currently, when a pokemon is created, the for...in loop in their species constructor iterates through their moveTable in reverse order and for each entry where the pokemon's starting level is equal to or greater than the required level for those moves, it pushes the moves onto their moves array until it reaches capacity at 4 moves.
However,
The issue with this is that every pokemon will keep their level 1 starting moves, even when created at very high levels. For species with two or three level1 moves, this could mean they are quite underpowered when created at high levels. Some more complex logic might be needed to replace lower level moves with higher level ones. so....

> rather than the main iteration being through moveTable, iterate through pokemon's moves array. for each slot in the moves array, check if it's null (this would mean manually declaring the moves arrays of every species with null in empty slots, and might mess up the logic of some other functions that rely on checking moves.length [pokemon.addMoves, battle.resolveTurn, maybe others]
> If the slot is null, push the highest level move to it as with current behaviour. If not null, iterate with for...in in reverse order as happens now. Same check to see if poke is high enough level for the moves in that movesArr, but without checking length. Instead, just replace the move in the current iteration's slot within poke's moves array and move to next slot in loop. Because we iterate moveTable in reverse order, it's not possible for the move in that slot to be of a higher level than the one we replace it with, so we should end up with the 4 highest level moves the pokemon can learn at the level it was created at.
> POTENTIAL ISSUE: depending on species and level created at, some pokemon may end up with completely sub-optimal movesets, e.g. no damage moves.
> POTENTIAL FIXES?:

- hardcoded preset movesets for pokemon of different levels? Probably the best option, just add a const movesPresets above the class declaration in each species file, add a few well-rounded, optimal movesets.
- add some randomness to starting moves but with caveat that they have to fit specific criteria, e.g. categorise moves by pos status, neg status, damage etc. This may be the best option if the end goal of the game is a procedural roguelike, as you wouldn't want all pokemon of the same level to have the same moves
- Another check after iterating and filling all moves slots - if no moves with doesDamage property, iterate moveTable high to low again until a move that doesDamage is found, replace one of the slots with that damage move (replacing lowest level move would be ideal but complex). Potentially good solution but lots of iteration and logic each time a pokemon is created, and may still result in suboptimal movesets, e.g. only one damage type, or multiple moves that inflict the same status

Bring battle loop in line with games: currently, player always goes first (pending implementation of pokemon speed). Currently, switching out unconscious pokemon is handled by resolveTurn() calling checkIfBattleOver once for each trainer. If player pokemon damages itself, checkIfBattleOver(player) will call choosePokemon. Immediately after that, checkIfBattleOver(opponent) will call choosePokemon if they have remaining pokemon. That promise chain gets resolved and returned to resolveTurn(). Opponent then goes straight to selecting a random move and using it with fight()
In the games, when a pokemon is downed, that round ends.
The trainer whose pokemon was downed immediately chooses a pokemon to bring out. The games have two modes, shift (where the player now gets to choose to change pokemon as a free action) and set (where they have to use their turn to switch if they want to do so)
The next round now begins. If the player had higher speed than the downed pokemon, acted first last round and downed the opponent before they could attack, and their pokemon also has higher speed than the replacement pokemon sent out, they can act twice in a row.
It seems that if the player pokemon is slower and acts second, this won't be the case, as the round fully ends (? unconfirmed)

--- NOTE WHEN ADDING CATCHDIFFICULTY TO SPECIES: at 1/4 health with a normal Poke Ball, catch ranges from ~4-11 ---

trainer resolveItem method currently only works correctly when using items in battle. for items used outside of battle, needs implementing differnetly

implement pokemon speed stat and move priority (e.g. quick attack)

implement special/physical attacks

implement evasion - in-game, accuracy and speed always start at 100 and attacks always hit until evasion or accuracy are increased/decreased

restructuring battle to avoid deeply nested then blocks - can checkIfBattleOver be refactored to only need calling once? It would help the nesting situation in resolveTurn if so. Can other promise-based functions be refactored to return out promises and chain .then blocks on the same level rather than nesting?

implement logic to run option - should only work on wild pokemon.

=====
DONE:
=====

Capturing: Currently logic partially implemented to store a pokemon in PC when party is full, but the actual storing mechanism hasn't been implemented. Already working in town.js so reuse from there

Lay out clearer structure for game loop: before getting to first town, battle with rival where losing doesn't matter (may need to add something in doendofbattle to skip the 'out of usable pokemon/blacked out messages on loss). Then force a guided battle with a rattata (at the moment their atk/def are equal to starters but should be lowered a couple of points) where you capture it.
