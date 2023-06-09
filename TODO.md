## TO IMPLEMENT

T3. new game save overwrite warning - when new game is started from main menu, load in save-data.json. if it loads in successfully, prompt them to confirm if they want to overwrite. Otherwise, assume there is no save data and go to begin-game.js

T4. multiple save slots (maybe undermines roguelike concept? somehow limit to not being able to save same character/run to multiple files?)- only needs implementing for manual saves in menu.js. extra prompt when menuAction === 'save' that lists 3 slots and if they have datta or not. auto-saves would need a way to track save slot loaded in from so they auto-save to the right slot

T6. FINISH randomTrainer/pokemon - generate random moves based on level, account for typePreferences and typeExclusive (maybe reorganise species so they're group by type on the exports object of species-data, then have two getRandoms - one to choose type, where their preferences are added an additional time to the array chosen from to weight in their favour, and the other to choose species within that type)

T9. Currently, when a pokemon is created, the for...in loop in their species constructor iterates through their moveTable in reverse order and for each entry where the pokemon's starting level is equal to or greater than the required level for those moves, it pushes the moves onto their moves array until it reaches capacity at 4 moves.
However,
The issue with this is that every pokemon will keep their level 1 starting moves, even when created at very high levels. For species with two or three level1 moves, this could mean they are quite underpowered when created at high levels. Some more complex logic might be needed to replace lower level moves with higher level ones. so....

> rather than the main iteration being through moveTable, iterate through pokemon's moves array. for each slot in the moves array, check if it's null (this would mean manually declaring the moves arrays of every species with null in empty slots, and might mess up the logic of some other functions that rely on checking moves.length [pokemon.addMoves, battle.resolveTurn, maybe others]
> If the slot is null, push the highest level move to it as with current behaviour. If not null, iterate with for...in in reverse order as happens now. Same check to see if poke is high enough level for the moves in that movesArr, but without checking length. Instead, just replace the move in the current iteration's slot within poke's moves array and move to next slot in loop. Because we iterate moveTable in reverse order, it's not possible for the move in that slot to be of a higher level than the one we replace it with, so we should end up with the 4 highest level moves the pokemon can learn at the level it was created at.
> POTENTIAL ISSUE: depending on species and level created at, some pokemon may end up with completely sub-optimal movesets, e.g. no damage moves.
> POTENTIAL FIXES?:

- hardcoded preset movesets for pokemon of different levels? Probably the best option, just add a const movesPresets above the class declaration in each species file, add a few well-rounded, optimal movesets.
- add some randomness to starting moves but with caveat that they have to fit specific criteria, e.g. categorise moves by pos status, neg status, damage etc. This may be the best option if the end goal of the game is a procedural roguelike, as you wouldn't want all pokemon of the same level to have the same moves
- Another check after iterating and filling all moves slots - if no moves with doesDamage property, iterate moveTable high to low again until a move that doesDamage is found, replace one of the slots with that damage move (replacing lowest level move would be ideal but complex). Potentially good solution but lots of iteration and logic each time a pokemon is created, and may still result in suboptimal movesets, e.g. only one damage type, or multiple moves that inflict the same status

T10. Bring battle loop in line with games: currently, player always goes first (pending implementation of pokemon speed). Currently, switching out unconscious pokemon is handled by resolveTurn() calling checkIfBattleOver once for each trainer. If player pokemon damages itself, checkIfBattleOver(player) will call choosePokemon. Immediately after that, checkIfBattleOver(opponent) will call choosePokemon if they have remaining pokemon. That promise chain gets resolved and returned to resolveTurn(). Opponent then goes straight to selecting a random move and using it with fight()
In the games, when a pokemon is downed, that round ends.
The trainer whose pokemon was downed immediately chooses a pokemon to bring out. The games have two modes, shift (where the player now gets to choose to change pokemon as a free action) and set (where they have to use their turn to switch if they want to do so)
The next round now begins. If the player had higher speed than the downed pokemon, acted first last round and downed the opponent before they could attack, and their pokemon also has higher speed than the replacement pokemon sent out, they can act twice in a row.
It seems that if the player pokemon is slower and acts second, this won't be the case, as the round fully ends (? unconfirmed)

T13. implement evasion - in-game, accuracy and speed always start at 100 and attacks always hit until evasion or accuracy are increased/decreased

T14. restructuring battle to avoid deeply nested then blocks - can checkIfBattleOver be refactored to only need calling once? It would help the nesting situation in resolveTurn if so. Can other promise-based functions be refactored to return out promises and chain .then blocks on the same level rather than nesting?

T16. implement rewards for winning battles. random amount of money based on (total xp of enemies defeated? loopNum? trainer difficulty rating discussed above [factors in pokemonCount and rarity of each pokemon]?) NPCs have specific item rewards, but nothing that actually gives them to the player (I think?). In games, items are not normally gained at end of battle. When it does happen, it's in a conversation afterwards, not part of the actual battle like money reward. However, here there will be less specific scripted battles with NPCs and therefore less chance to get items as rewards. Also no items found in world or given during story. Maybe randomTrainer should have a small chance to generate item reward for defeating that trainer, like NPCs do?

T19. movesData - accuracy almost all at 100%. In games, most moves have 95% or less. Is accuracy checked/used anywhere? battle.js fight may not take it into account at all, so needs implementing. Pokemon also now all have an accuracy stat, at 100 for all species. Can be lowered by enemy moves and should be taken into account along with move base accuracy

T20. because species are completely randomised and only selector will be rarity, whereas in games it's based on area, it will be much harder to find a specific pokemon:

    > make one of the walk around town events finding someone who can give you a tip for finding a specific pokemon.Maybe you input species name or choose from a small selection of random species they know how to find etc.
    > have some shops sell lures for specific types/species

T21. Make better use of specialBattle prop of Battle - instead of just passing a unique battle name and having console logs everywhere that check the battle name, pass in an array of objects on specialBattle, where each object is a message with text: blabla and event: playerWinsBattle / battleStart etc.

T22. Two-turn moves like fly and dig. Fly added with turn1Effect and turn2Effect properties in its effectOnSelf, is this the best way? how to implement in battle?

T23. outside of battle moves - usable from pokemonMenu if it has an effectOutsideBattle property. Fly has this with property lureType: 'flying'. Should make randomTrainer and randomWildPokemon invoked with typePreferences flying, dig can do ground/rock, strength fighting, surf water/ice, cut grass/bug etc. Currently these are usable anywhere from menu, including in towns, maybe should give a different message if used in town? or just say 'until the next town, battles will be with flying types etc.'

T25. auto-save when choosing quit from the menu to enhance roguelike feel - although very easy to just kill process with ctrl-c, probably still worth doing as gentle encouragement not to save scum, and for the convenience of not having to manually save before quitting

T26. in introCatchBattle, no handling for if you kill the rattata or lose to it somehow. In these situations, Oak should probably full heal your pokemon and restart the fight. Only obvious way to do this is make introCatchBattle a function that can recursively call itself if you don't successfully capture.

T27. Convert species/types/pokemon to accept an options object for most parameters that will be rarely used (stats, moves etc.) Will be particularly useful for creating pokemon with isEvolving to avoid lots of nulls before true for isEvolving at the end

T28. pokemon menu option should also allow renaming and resetting name to default

T29. in quite a few places, currentPlayerData/playerData is returned from a function and then reset e.g. then((playerData) => {
currentPlayerData = playerData
}). This is unnecessary because currentPlayerData is an object, so the reference remains the same. When changes happen from within a menu or a battle for instance, they are made to the same playerData object using a different reference, so should automatically be reflected in other files

T30. add more frequent auto-saves - should really probably be one after each other block

T31. Convert console.logs to Conversations throughout so player controls flood of messages. transition from battle1 to menu is jarring and unclear. Add some kind of message between. Maybe defeat message should be part of a Conversation to make sure player sees/acknowledges it. Could then add to that Conversation some other random message like random town messages. randomTravelMessage maybe. e.g. 'You keep walking, but after a while your stomach rumbles. Time to stop and take a break!'

T32. paralysed and burning condition also affect affect stats. currently implemented by just lowering the relevant stat by 2 stages (reduce by 50%). This probably isn't best solution, especially because it can stack with multiple uses of a paralysis causing move, e.g. stun spore 2 turns in a row. It will then give a message that the stat is too low and the move had no effect, which isn't necessarily true. For instance, if the speed is already lowered to the min threshold by other moves like string shot, then stun spore is used, the speed lowering part will have no effect but the paralysis condition will still be applied. Really needs to be a separate mechanic to normal resolveStatusMove effect.stat method, should apply a flat 50% reduction after other considerations. burning condition should halve damage with physical attacks (phys/spec attack not yet implemented)

T33. in games, switching pokemon in battle resets stat changes (but not status conditions). adds a layer of tactics to things like roar and whirlwind to force an enemy to switch out a highly buffed pokemon. Maybe makes status moves less worth it though?

T34. poison condition should damage outside of battle, burn should not

T35. Allow viewing pokemon details in battle like in menu.js. Battle decisions may depend on knowing if a pokemon has a certain move, has pp left for that move, has a certain speed, higher atk or phys atk etc., so should be checkable.

T36. Add abilities - randomly generated on pokemon creation, unique positive or negative passive effect, either in battle, out of battle or both. evolution changes ability based on previous form's ability

T37. Make move display more useful when selecting one to use. At the very least, needs to show type.

T38. implement roaming pokemon. normally these are legendary or very rare pokemon that move around between areas and will try to flee battle. battle checks its specialBattleType param, if it = 'roaming', the opponent has a chance of selecting the Run action. (in games this is either 10% or 50% depending on the pokemon, for the rare regular wild pokemon. For actual roaming legendaries/shinies they always try to flee on first turn). When they try to flee, it happens immediately before it would use its move, meaning the move priority and pokemon speed affect whether or not you get a chance to use a move first. Item use always happens before moves so always get a chance to catch in a ball. Fast ball could be implemented here (in games it just has a higher catch rate against pokemon with over 100 speed, but maybe could have an effect specifically for roaming?). Fleeing is prevented by 'trapping' moves like Wrap and Mean Look, or by sleep/freeze conditions. Maybe paralyse should also prevent when its full paralysis triggers. These moves/conditions should set the battle's opponentEscapePrevented prop to true, logic in setOpponentAction should already prevent them from choosing Run as action if that's true, and they will always be wild if roaming, so pokemon and item will be skipped, meaning their action will be fight.

T39. Give opponent trainers randomly generated inventory. They currently have a chance to choose Item as their action, but only start with money in inventory. If no other items a new random action is chosen.

## STATS SYSTEM

40 is base level (10 + level \* 2), each 5 points above or below adds or subtracts 1

## BUGS

B1. need better system for randomTrainer difficulty - a trainer on loop 1 had a butterfree, which will be quite a tough fight. Might be OK if it's their only Pokemon, but if their random pokemonCount was 2 or 3 it would be a likely party wipe. Maybe calculate trainer difficulty, taking into account pokemon rarity AND count -- ALSO encountered a charizard on loop 2. Only once in many tests, but yikes, full party wipe

B8. setCurrentPokeballs - see comment in function about issue with pokemon being incorrectly marked 'already out'

B9. in randomTrainer, trainer.messages and trainer.defeatMessages are returned as a single item in an array. Is there any reason for this?

B10. in doEndOfBattle, activeEffects that don't have staysAfterBattle property are deleted for each pokemon. However, this doesn't undo any stat changes. To undo the exact change and only that change for each move (e.g. in case multiple moves have lowered defence, each by a different amount), resolveStatusMove will need to keep track of the amount the stat was lowered by and add it to the activeEffect, so that when doEndOfBattle is iterating through activeEffects it can add that amount back on to the stat. needs to be a method that can also be used by healToFull (currently just manually sets current values to max) and remove items

B11. crashed after first town, loaded most recent save (auto-save when leaving town). Town name was correctly saved and replicated, but PokeMart stock is generated fresh. Should this be stored? maybe townsVisited array stores a copy? Quite a lot of unnecessary data to store for very little reason tbh

B12. in introRivalBattle, rival squirtle's tail whip is still far more effective than player charmander's growl. damage formula was changed so that in a vacuum, lowering target def one stage has the exact same effect as raising attacker's atk and vice versa. Probably because lowering by a stage lowers by 25%, so final difference to damage will be greater if the stat is higher. Is squirtle just stronger than charmander? test by temporarily giving squirtle growl instead of tail whip and vice versa

=====
DONE:
=====

Capturing: Currently logic partially implemented to store a pokemon in PC when party is full, but the actual storing mechanism hasn't been implemented. Already working in town.js so reuse from there

Lay out clearer structure for game loop: before getting to first town, battle with rival where losing doesn't matter (may need to add something in doendofbattle to skip the 'out of usable pokemon/blacked out messages on loss). Then force a guided battle with a rattata (at the moment their atk/def are equal to starters but should be lowered a couple of points) where you capture it.

battle.js - add new method 'awardXP' using logic with participatingPokemon etc. currently in checkIfBattleOver.
Call this new method in fight immediately after console logigng '\_\_\_ fainted!'. (may want to add delays to avoid a flood of text as each pokemon gains xp, which would cause issues because fight is not async, may be better to call awardXp in an async method) - actually realised that checkIfBattleOver is called after each turn, so able to call it there

Implement the main loop after first town: recursion? Have a separate file that is a function with a then block of battles then town. That function recursively calls itself, passing in updated player data each time

in speciesData, is newPokemon method needed? Seems like it may be superceded by create. if removing that method, can also update randomTrainer.js>randomPokemon() - it currently filters speciesData to remove newPokemon when randomly choosing a species

> captured rattata added to belt but not pokemonlist // resolved
> string shot usable by weedle but no pokemon have speed stat so its resolveStatusMove fails when it can't find target[effect.stat] // resolved but speed currently just set to default in pokemon.js and doesn't do anything
> first trainer battle - enemy pokemon are starting at ~level9 // resolved

improve accuracy of stats - some pokemon are currently slightly differently balanced than bulbapedia stats. 40 is base level (10 + level \* 2), each 5 points above or below adds or subtracts 1

species should have a rarity property, randomPokemon method in randomTrainer.js should use this rarity, acepting it as an argument and basing result on it. e.g. if I specify rrity 1, there should be almost no cahnce of getting pokemon above rarity 5, 75% chance of rarity 1, 10/15/20% chance of rarity 2 etc. - especially important for wild pokemon.
(note - randomWildPokemon method should be updated to use randompokemon directly instead of using fillpokemonarr)

> poke mart always empty in first town // resolved - currentPlayerData had been changed, no longer had progressLevel that was used before, updated to use stageToLoad number at end
> on loadGame where I had stored charmander then withdrew it to make it second in list behind rattata, beating an enemy with rattata gave charmander the experience instead. // resolved - store function in town didn't update currentPokeball

useItem: pokemonChoices should add indicators for active status conditions

pokemonChoices pad after name so level onwards is aligned

potions - currently they use effect stat modifying system but have staysAfterBattle true. This might be OK because so far I think the only thing that clears staysAfterBattle effects is the correct remove item (just don't make one for potions) or pokemon centre, which fully heals anyway

Assign each then block in game.js and game-loops.js an ID. For gameLoop the ID is stage+block(?)
When loading, each block in game.js passes through if not the intended stageToLoad e.g:
if (stageToLoad !== <block_ID>) return Promise.resolve()
Might need to account for position within a block. Town blocks can be restarted on load without any issues, but Conversation blocks and battle blocks might need to track if the save happened before or after. Maybe add a tag onto the stageToLoad ID e.g. stageToLoad = introBattle-before / stageToLoad = introBattle-after
After intro battles, NOW can visit first town and heal up (maybe a firstTown param on enter town so that events in the town can work differently e.g. console log telling you to go heal, try to leave without pokemon at full doesn't work etc.)
Finally, after that you face a couple more wild pokemon then an early trainer

trainer resolveItem method currently only works correctly when using items in battle. for items used outside of battle, needs implementing differnetly

String Shot added to Caterpie and movesData - set up correctly to lower speed stat, but pokemon don't have a speed stat currently

REWORK RANDOM TRAINER LEVEL SCALING:
currently, based off level passed in to random trainer function, generates pokemon of a level roughly equal to level passed in.

> Instead, maybe stick closer to original games and generate them by area rather than scaling to player. use loopNum in the equation somehow. Maybe also take into account how many pokemon are being generated.

antidote has been added to items-data, with type remove. its effect has a .remove property which specifies the condition it removes. implement this.

visited towns system - best way is probably adding townsData to saveGame and loading it in with updates. current layout means they'll all always have visited: false

Add secondary effects to damage moves: ember and thunder shock should have 10% chance of burning/paralyzing

T24. finish menu.js, implementing submenus for each action.

B2. charmander evolved to Charmeleon at level 2

B3. charmander with no name (Defaulting to species name) evolves into charmeleon, name doesn't change. do a check on evolve when creating instance of new evolvedForm: if (this.name === this.species) nameToUse = this.evolvesTo.species

B4. error that seems to imply rattata was trying to evolve. check evolvesTo logic, don't think it currently has logic to check if the pokemon evolves to anything

    > "/home/theo/northcoders/fundamentals/fun-pokemon-battler/main-game/scenes/battle.js:374

          message: `${pokemonToAwardXp.name} is trying to evolve into ${pokemonToAwardXp.evolvesTo.species}!\n\nLet it evolve?`,

TypeError: Cannot read properties of undefined (reading 'species')
"

B6. charmeleon has new param added - isEvolving. if level > 1 loop that adds highest level moves, now also checks that constructor isn't invoked with isEvolving true. Ensures that moves aren't replaced without a chance to confirm when pokemon evolves, only pushed to moves array when it's a brand new pokemon.
add this to all other evolved form species - currently, some like butterfree have higher level moves that aren't all fully implemented, so they don't have the loop at all

T1. need chances to save game/use items/check on and rearrange pokemon out of battle:
add options to do all 3 manually in town //
add a prompt between gameloop battle stages //

B5. tested a full game-loop, all working. However, second town I came to had the same name as the first. I thought townNames should be filtered to remove any in the townsVisited array on playerData. If that's not working, would be a huge coincidence for it to generate the same one again, so it may be the logic implemented to ensure same town is generated when reloading a town save is causing issues.

B7. able to use potions on fainted pokemon

B13. tail whip seems much more effective than growl in the introRivalBattle - will probably be true of other attack/defence reducing moves too. see if damage formula can be tweaked

B12. player battle loss not handled in game loop

T2. status effect conditions should now be correctly applied by moves and removed by remove items, but no status conditions have actual tangible effects yet. do some kind of check at start of round to see if activeEffects includes an effect object with a status property.

T8. Moves have a uses property - currently uses game values which are very high (30 for tackle). useMove needs to reduce this by 1 (currently the property is only in movesData, needs storing separately. Maybe an array of length 4 where each number represents the num of uses of the move in that slot? if so, will need to be refreshed when an old move is replaced with a new one on level up)

T5. item type property - currently is just a string, which has been fine so far. Full Restore now added which heals AND removes condition. left it as type: 'heal' for now so it's correctly handled by useItem, but probably should be converted to an array of types to allow for multiple types like ['heal', 'remove']

T7. added some misc items that should console log a message when used from the menu outside of battle, they have an effect.message property for this.

T15. implement logic to run option - should only work on wild pokemon.

T17. First dual-type pokemon added in Pidgey. Types system currently not really set up for this, so it's just a flying type currently, should be flying and normal.

    > May be the time to take out the type classes, as all they currently do is set the type and call super
    > Then, this.type can be an array of types
    > Will need to then update pokemon.js isWeakTo etc., check this.types.includes(...)
    > Any other things to change/update that make use of pokemon type directly? Will affect randomTrainer typePreferences, but those haven't been implemented yet
    > Will affect type display in menu>pokemonDetails, will need to list multiple types

T18. pokemon.js now has isImmuneTo method, but not called/checked for in battle.js fight method

T12. implement special/physical attacks

T11. implement pokemon speed stat and move priority (e.g. quick attack)
