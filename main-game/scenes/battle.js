const inquirer = require('inquirer');
const fs = require('fs/promises');
const { Trainer } = require('../trainers/trainer.js');
const { Player } = require('../trainers/player.js');
const { WildPokemon } = require('../trainers/wild-pokemon.js');
const { movesData } = require('../data/moves-data.js');
const create = require('../data/create.js');
const {
  randomTrainer,
  randomWildPokemon,
} = require('../trainers/random-trainer');
const { loadGame } = require('../load-game.js');
const { itemsData } = require('../data/items-data.js');
const { delay, delayInit, createDelay } = require('../../utils/delay');
delayInit();

class Battle {
  constructor(player, opponent, currentPlayerData, specialBattleType) {
    this.player = player;
    this.opponent = opponent;
    this.currentPlayerData = currentPlayerData;
    this.specialBattleType = specialBattleType;
    this.playerPokemon = this.player.currentPokeball.storage;
    this.playerPokemonIndex = this.player.belt.indexOf(
      this.player.currentPokeball
    );
    this.opponentPokemon = this.opponent.currentPokeball.storage;
    // this.currentTrainer = player;
    // this.currentTrainerPokemon = this.currentTrainer.currentPokeball.storage;
    // this.otherTrainer = opponent;
    // this.otherTrainerPokemon = this.otherTrainer.currentPokeball.storage;
    this.turnNumber = 1;
    this.battleOver = false;
    this.winner = null;
    this.loser = null;
    this.participatingPokemon = [this.playerPokemonIndex];
  }

  startBattle() {
    console.log(
      this.player.currentPokeball,
      '<<< CURRENT POKEBALL START OF BAT'
    );
    console.log(
      this.opponent.isWild
        ? `A wild ${this.opponent.wildPokeObj.name} appeared!`
        : `${this.opponent.name} wants to fight!`
    );
    return createDelay(1500)
      .then(() => {
        return this.setCurrentPokeballs();
      })
      .then(() => {
        return this.inBetweenTurns();
      });
  }
  resolveTurn() {
    return createDelay(1000)
      .then(() => {
        return this.checkIfBattleOver(this.player);
      })
      .then(() => {
        return this.checkIfBattleOver(this.opponent);
      })
      .then(() => {
        if (this.opponentPokemon.hitPoints.current) {
          // TO ADD: check if hp ratio is above x% and use healing item if they have one and trainer is not wildPokemon, try and run in other situation etc.

          function modBy50(stat, stagesToModBy) {
            const stageOfStat = stat / 4;
            return stat + stageOfStat * stagesToModBy;
          }

          // CHOOSE A RANDOM MOVE FOR THE OPPONENT'S POKEMON
          const moves = this.opponentPokemon.moves;
          const randomIndex = Math.floor(Math.random() * moves.length);
          let randomMove = movesData[moves[randomIndex]];
          const affectedStat = randomMove.effectOnTarget
            ? this.playerPokemon[randomMove.effectOnTarget.stat]
            : randomMove.effectOnSelf
            ? this.opponentPokemon[randomMove.effectOnSelf.stat]
            : null;
          const effectModifier = randomMove.effectOnTarget
            ? randomMove.effectOnTarget.modifier
            : randomMove.effectOnSelf
            ? randomMove.effectOnSelf.modifier
            : null;
          //////

          // If the randomly chosen move inflicts a status effect but the stat is too high or low to do anything, change to a different move

          //(currently just changes the move index by 1, could be improved by eliminating the ineffective move from the pool to choose from and choosing randomly again from the shortened move list)
          if (affectedStat) {
            const statAfterMod = +modBy50(
              affectedStat.current,
              effectModifier
            ).toFixed(2);
            const newRandomIndex =
              moves.length === 1
                ? randomIndex
                : randomIndex === 0
                ? randomIndex + 1
                : randomIndex - 1;

            if (
              statAfterMod <= affectedStat.max * 0.3 ||
              statAfterMod >= affectedStat.max * 1.7
            )
              randomMove = movesData[moves[newRandomIndex]];
          }
          ///////

          console.log('\n----------');
          this.fight(randomMove, this.opponentPokemon, this.playerPokemon);
          return Promise.resolve();
        }
      })
      .then(() => {
        return this.checkIfBattleOver(this.player);
      })
      .then(() => {
        return this.checkIfBattleOver(this.opponent);
      })
      .then(() => {
        this.turnNumber++;
        return this.battleOver ? this.doEndOfBattle() : this.inBetweenTurns();
      });
  }

  choosePokemon(trainer) {
    if (!trainer.isPlayer) {
      this.setNextPokemon(trainer);
      trainer.currentPokeball.throw();
      console.log(
        `${this.opponent.name} sent out ${this.opponentPokemon.name}!`
      );
      return Promise.resolve();
    } else {
      const pokemonChoices = trainer.getPokemonChoices(true);
      pokemonChoices.push('--CANCEL--');

      return inquirer
        .prompt([
          {
            type: 'list',
            name: 'pokemonChoice',
            message: `Choose a Pokemon to send out...`,
            choices: pokemonChoices,
          },
        ])
        .then((answers) => {
          if (answers.pokemonChoice === '--CANCEL--') return false;
          else {
            const selectedPokemon = answers.pokemonChoice.split(':')[0];
            const selectedPokemonIndex =
              trainer.getPokemon(selectedPokemon).index;
            trainer.currentPokeball = trainer.belt[selectedPokemonIndex];
            this.playerPokemon = this.player.currentPokeball.storage;
            this.playerPokemonIndex = this.player.belt.indexOf(
              this.player.currentPokeball
            );

            console.log(`Go, ${this.playerPokemon.name}!`);
            trainer.currentPokeball.throw();
            if (!this.participatingPokemon.includes(selectedPokemonIndex))
              this.participatingPokemon.push(selectedPokemonIndex);
            console.log(
              this.player.currentPokeball,
              '<<< CURRENT POKEBALL AFTER CHOOSE'
            );
            return true;
          }
        });
    }
  }

  doBattle() {
    const playerInvKeys = Object.keys(this.player.inventory);
    const battleItemKeys = playerInvKeys.filter((item) => {
      return itemsData[item].useInBattle;
    });
    const itemChoices = battleItemKeys[1]
      ? battleItemKeys.map(
          (itemKey) => `${itemKey}: ${this.player.inventory[itemKey]}`
        )
      : [
          {
            name: ' ',
            disabled: 'You have no items that can be used in battle!',
          },
        ];
    itemChoices.push('--CANCEL--');

    // Intro battle dialogue
    if (this.specialBattleType === 'introCatchBattle' && this.turnNumber === 1)
      console.log(
        '\nProfessor Oak:  If you want to catch a wild Pokemon, you need to weaken it first. The more damage you do to it, the easier it will be to catch!\n'
      );
    else if (
      this.specialBattleType === 'introCatchBattle' &&
      this.turnNumber > 1
    )
      console.log(
        '\nProfessor Oak:  It looks weak! You can try to catch it by choosing the Pokeballs I gave you from the "Item" menu.\n'
      );
    /////

    return inquirer
      .prompt([
        {
          type: 'list',
          name: 'action',
          message: `Choose your action...`,
          choices: ['Fight', 'Pokemon', 'Item', 'Run'],
        },
        {
          type: 'list',
          name: 'move',
          message: `Choose your move...`,
          choices: [...this.playerPokemon.moves, '--CANCEL--'],
          when: (answers) => answers.action === 'Fight',
        },
        {
          type: 'list',
          name: 'item',
          message: `Choose your item...`,
          choices: itemChoices,
          when: (answers) => answers.action === 'Item',
        },
      ])
      .then((answers) => {
        if (answers.action === 'Fight') {
          if (answers.move === '--CANCEL--') return this.doBattle();
          else {
            this.fight(
              movesData[answers.move],
              this.playerPokemon,
              this.opponentPokemon
            );
            return this.resolveTurn();
          }
        } else if (answers.action === 'Pokemon') {
          return this.choosePokemon(this.player).then((choice) => {
            if (choice) return this.resolveTurn();
            else return this.doBattle();
          });
        }
        if (answers.action === 'Item') {
          if (answers.item === '--CANCEL--') return this.doBattle();
          else {
            const itemToUse = answers.item.split(':')[0];
            return this.player
              .useItem(
                itemToUse,
                this.player,
                this.opponent,
                this.opponentPokemon,
                this.currentPlayerData
              )
              .then((result) => {
                if (result === 'captureSuccess') {
                  this.battleOver = true;
                  this.winner = this.player;
                  this.loser = this.opponent;
                  return this.doEndOfBattle();
                } else if (result === 'cancel') return this.doBattle();
                else return this.resolveTurn();
              });
          }
        }
      });
  }

  setNextPokemon(trainer) {
    for (let i = 0; i < trainer.belt.length; i++) {
      const pokeball = trainer.belt[i];
      if (pokeball.storage && pokeball.storage.hitPoints.current) {
        trainer.currentPokeball = trainer.belt[i];
        this.opponentPokemon = this.opponent.currentPokeball.storage;
        this.playerPokemon = this.player.currentPokeball.storage;
        return true; // tells setCurrentPokeballs that this trainer hasValidPokemon (i.e. with > 0 hitPoints)
      }
    }
    return false; // otherwise tells setCurrentPokeballs false
  }

  setCurrentPokeballs(trainer) {
    if (!trainer) {
      // when called with no arguments in startBattle, throw out first pokemon with hitPoints for each trainer
      this.setNextPokemon(this.opponent);
      this.opponent.currentPokeball.throw();
      if (!this.opponent.isWild)
        console.log(
          `${this.opponent.name} sent out ${this.opponentPokemon.name}!`
        );
      return createDelay(1500).then(() => {
        this.setNextPokemon(this.player);
        console.log(`Go, ${this.playerPokemon.name}!`);
        this.player.currentPokeball.throw();
      });
    } else {
      // when called with one specific trainer in checkIfBattleOver, check if that trainer has any pokemon with hp
      const currentPokeballIndex = trainer.belt.indexOf(
        trainer.currentPokeball
      );
      const hasRemainingPokemon = this.setNextPokemon(trainer);
      trainer.currentPokeball = trainer.belt[currentPokeballIndex]; // Quick and dirty solution, maybe a better way to refactor this later. This was causing problems with choosing pokemon because setNextPokemon changes currentPokeball - first available pokemon is set as currentPokeball before player chooses a pokemon to send out, so one of their choices is incorrectly shown as 'already out'

      // If trainer does have remaining pokemon, let them choose one to throw out
      if (hasRemainingPokemon) {
        return this.choosePokemon(trainer);
      } else {
        return Promise.resolve();
      }
    }
  }

  doEndOfBattle() {
    // For each pokemon, remove any active effects that don't persist
    this.player.belt.forEach((ball) => {
      for (const effect in ball.storage.activeEffects) {
        if (!effect.staysAfterBattle) delete ball.storage.activeEffects[effect];
      }
    });
    /////
    // Reset currentPokeball to first in pokemonList
    this.player.currentPokeball = this.player.belt.findIndex(
      (ball) => ball.storage.name === this.player.pokemonList[0]
    );
    /////
    console.log(this.player.currentPokeball, '<<< CURRENT POKEBALL END OF BAT');
    this.currentPlayerData.player = this.player;
    if (this.loser.isWild) {
      console.log('\nYou won!\n');
      return { isBlackedOut: false, currentPlayerData: this.currentPlayerData };
    } else if (this.loser.isPlayer) {
      if (this.specialBattleType === 'introRival') {
        console.log(
          `\n${this.winner.name}:  Haha, I told you I'd win! Next time we meet, I'll be even stronger!\n`
        );
        return {
          isBlackedOut: false,
          currentPlayerData: this.currentPlayerData,
          introRivalBattleLost: true,
        };
      } else {
        console.log(`${this.loser.name} is out of useable Pokemon!`);
        console.log(`${this.loser.name} blacked out!`);
        return {
          isBlackedOut: true,
          currentPlayerData: this.currentPlayerData,
        };
      }
    } else {
      console.log(`\n${this.winner.name} defeated ${this.loser.name}!`);
      if (this.specialBattleType === 'introRival') {
        console.log(
          `\n${this.loser.name}:  Next time I won't go easy on you, so train well!\n`
        );
      }
      return { isBlackedOut: false, currentPlayerData: this.currentPlayerData };
    }
  }

  awardXp(defeatedPokemon) {
    const winningTrainer =
      defeatedPokemon === this.opponentPokemon ? this.player : this.opponent;

    if (winningTrainer === this.player) {
      const totalXpToAward = defeatedPokemon.level * 2;
      const shareOfXp = Math.max(
        1,
        Math.round(totalXpToAward / this.participatingPokemon.length)
      );
      const xpPrompts = [];
      this.participatingPokemon.forEach((pokemonIndex) => {
        const pokemonToAwardXp = this.player.belt[pokemonIndex].storage;
        let evolving = { species: null };
        xpPrompts.push({
          type: 'input',
          name: pokemonIndex.toString(),
          message: () => pokemonToAwardXp.showXpBar(),
          when: () => {
            evolving.species = pokemonToAwardXp.addXp(shareOfXp);
            return true;
          },
        });
        xpPrompts.push({
          type: 'confirm',
          name: `${pokemonIndex.toString()}-evolving`,
          message: `${pokemonToAwardXp.name} is trying to evolve into ${pokemonToAwardXp.evolvesTo.species}!\n\nLet it evolve?`,
          when: () => evolving.species,
        });
        xpPrompts.push({
          type: 'input',
          name: `${pokemonIndex.toString()}-when`,
          message: ` `,
          when: (answers) => {
            if (answers[`${pokemonIndex.toString()}-evolving`]) {
              this.player.belt[pokemonIndex].storage =
                pokemonToAwardXp.evolve();
            }
            return false;
          },
        });
        xpPrompts.push({
          type: 'input',
          name: `${pokemonIndex.toString()}-doEvolution`,
          message: () =>
            `${pokemonToAwardXp.name} evolved into ${pokemonToAwardXp.evolvesTo.species}!\n${this.player.belt[pokemonIndex].storage.art}`,
          when: (answers) => answers[`${pokemonIndex.toString()}-evolving`],
        });
      });

      return inquirer.prompt(xpPrompts);
    } else return Promise.resolve();
  }

  checkIfBattleOver(trainer) {
    //trainer.currentPokeball.storage prevents errors if checkIfBattleOver is called and setCurrentPokeballs has not correctly initialized, only possible in dev / testing environment eg. if setCurrentPokeballs is invoked only after a trainer's pokemon are all fainted and there is no pokemon in the default current pokeball#

    if (
      !this.battleOver &&
      trainer.currentPokeball.storage &&
      !trainer.currentPokeball.storage.hitPoints.current
    ) {
      const defeatedPokemon = trainer.currentPokeball.storage;
      return this.awardXp(defeatedPokemon)
        .then(() => this.setCurrentPokeballs(trainer))
        .then(() => {
          if (!trainer.currentPokeball.storage.hitPoints.current) {
            this.winner = trainer === this.player ? this.opponent : this.player;
            this.loser = trainer;
            this.battleOver = true;
          }
        });
    } else {
      // If pokemon still has hp, return an empty promise so that the function that called checkIfBattleOver can use .then on whatever checkIfBattleOver returns without errors
      return Promise.resolve();
    }
  }

  inBetweenTurns() {
    return createDelay(1000).then(() => {
      console.log('\n-------');
      console.log(`Turn ${this.turnNumber}`);
      console.log('-------\n');
      return this.doBattle();
    });
  }

  getCriticalHit() {
    return Math.floor(Math.random() + 0.2);
  }

  resolveStatusMove(move, user, target) {
    function modBy50(stat, stagesToModBy) {
      const stageOfStat = stat / 4;
      return stat + stageOfStat * stagesToModBy;
    }
    const targetsSelf = target === user;
    const effect = targetsSelf ? move.effectOnSelf : move.effectOnTarget;
    if (effect.stat) {
      const effectMessage =
        effect.modifier === 1
          ? 'rose!'
          : effect.modifier > 1
          ? 'rose sharply!'
          : effect.modifier === -1
          ? 'fell!'
          : 'fell sharply!';

      const statAfterMod = +modBy50(
        target[effect.stat].current,
        effect.modifier
      ).toFixed(2);
      if (
        statAfterMod <= target[effect.stat].max * 0.25 ||
        statAfterMod <= target.level
      ) {
        console.log(
          `${target.name}'s ${effect.stat} is already too low. ${move.name} had no effect!`
        );
        return;
      }
      if (
        statAfterMod >= target[effect.stat].max * 1.75 ||
        statAfterMod >= 500
      ) {
        console.log(
          `${target.name}'s ${effect.stat} is already too high. ${move.name} had no effect!`
        );
        return;
      }
      target[effect.stat].current = statAfterMod;
      target.activeEffects[move.name] = effect;
      console.log(`${target.name}'s ${effect.stat} ${effectMessage}`);
    }
    if (effect.status) {
      if (Math.random() > effect.statusChance) {
        if (!move.doesDamage)
          console.log(`${user.name}'s ${move.name} failed!`);
        return;
      } else {
        const alreadyAffected = Object.values(target.activeEffects).find(
          (activeEffect) => activeEffect.status === effect.status
        );
        const innerMessage = alreadyAffected ? 'is already' : 'is';
        console.log(`${target.name} ${innerMessage} ${effect.status}!`);
        target.activeEffects[move.name] = effect;
      }
    }
  }

  fight(move, attackingPokemon, defendingPokemon) {
    const attacker = attackingPokemon.name;
    const defender = defendingPokemon.name;
    let hasValidTarget = defendingPokemon.hitPoints.current > 0;
    const baseDamage = attackingPokemon.useMove(move, defendingPokemon);

    // CALCULATE HIT CHANCE HERE

    if (move.effectOnSelf)
      this.resolveStatusMove(move, attackingPokemon, attackingPokemon);
    if (move.effectOnTarget)
      this.resolveStatusMove(move, attackingPokemon, defendingPokemon);
    if (!move.doesDamage) return;

    // Calculate attacking pokemon's damage,
    let damage = defendingPokemon.isWeakTo(move)
      ? 1.25 * baseDamage
      : defendingPokemon.isResistantTo(move)
      ? 0.75 * baseDamage
      : baseDamage;
    // accounting for type weaknesses

    const isCriticalHit = this.getCriticalHit();
    damage += isCriticalHit * 2;
    const finalDamage = +damage.toFixed(2);

    if (hasValidTarget) {
      // Deal damage to defending pokemon
      defendingPokemon.takeDamage(finalDamage);
      const defendingHitPointRatio =
        defendingPokemon.hitPoints.current / defendingPokemon.hitPoints.max;
      // and calculate how badly damaged it is now

      if (defendingPokemon.isWeakTo(move)) console.log("It's super effective!");
      if (defendingPokemon.isResistantTo(move))
        console.log("It's not very effective...");
      if (isCriticalHit) console.log("It's a critical hit!");

      // Separator for clearer output
      console.log('\n');
      //////////////////////////////

      console.log(`${attacker} dealt ${finalDamage} damage`);
      console.log(
        `${defender} has ${defendingPokemon.hitPoints.current} hit points remaining`
      );

      // Separator for clearer output
      console.log('\n');
      //////////////////////////////

      console.log(
        !defendingPokemon.hitPoints.current
          ? `${defender} fainted!`
          : defendingHitPointRatio > 0.8
          ? `${defender} barely has a scratch...`
          : defendingHitPointRatio > 0.5
          ? `${defender} is slightly damaged!`
          : defendingHitPointRatio > 0.25
          ? `${defender} is heavily damaged!`
          : `${defender} is barely standing!`
      );
    } else {
      console.log(
        `${attacker}'s ${move.name} missed because there was nothing to hit!`
      );
    }
  }

  // changeCurrentTrainer() {
  //   [this.currentTrainer, this.otherTrainer] = [
  //     this.otherTrainer,
  //     this.currentTrainer,
  //   ][(this.currentTrainerPokemon, this.otherTrainerPokemon)] = [
  //     this.otherTrainerPokemon,
  //     this.currentTrainerPokemon,
  //   ];
  // }
}

// const gerty = create.pokemon('Butterfree', 'Gerty', 15);
// const maude = create.pokemon('Weedle', 'Maude', 6);
// const sq1 = create.pokemon('Squirtle', 'sq1', 6);
// const sq2 = create.pokemon('Squirtle', 'sq2', 6);
// const sq3 = create.pokemon('Squirtle', 'sq3', 6);
// const sq4 = create.pokemon('Squirtle', 'sq4', 6);
// const jeb = new Player('Jebediah', [gerty, maude, sq1, sq2, sq3, sq4]);

// const phil = create.pokemon('Charmander', 'Phil', 5);
// const paula = create.pokemon('Charmander', 'Paula', 5);
// const butch = new Trainer('Butch', [phil, paula]);

// const wild = randomWildPokemon(4, 'Rattata');
// jeb.inventory['Poke Ball'] = 3;
// jeb.inventory['Great Ball'] = 1;
// jeb.inventory['Potion'] = 2;
// jeb.inventory['Protein'] = 1;

// let currentPlayerData;
// // LOAD GAME
// loadGame()
//   // INIT currentPlayerData
//   .then(({ playerData, rivalData }) => {
//     currentPlayerData = playerData;
//     currentPlayer = currentPlayerData.player;
//     return createDelay(100);
//   })
//   .then(() => {
//     const testBattle = new Battle(jeb, wild.battleTrainer, currentPlayerData);
//     testBattle.startBattle();
//   });

module.exports = { Battle };
