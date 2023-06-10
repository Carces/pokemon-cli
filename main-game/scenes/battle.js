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
    this.escapeAttempts = 0;
    this.isEscaped = false;
  }

  startBattle() {
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
          const statusResult = this.doStatusEffect(this.opponentPokemon, false);
          if (statusResult === 'skip') return Promise.resolve();

          // CHOOSE A RANDOM MOVE FOR THE OPPONENT'S POKEMON
          const moves = this.opponentPokemon.getMoveChoices(false, true);
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
          this.doStatusEffect(this.opponentPokemon, true);
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
    const moveChoices = this.playerPokemon.getMoveChoices();

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
          choices: [...moveChoices, '--CANCEL--'],
          when: (answers) => answers.action === 'Fight',
        },
        {
          type: 'list',
          name: 'item',
          message: `Choose your item...`,
          choices: itemChoices,
          when: (answers) => answers.action === 'Item',
        },
        {
          type: 'confirm',
          name: 'runConfirm',
          message: `Attempt to run from battle?`,
          when: (answers) => answers.action === 'Run' && this.opponent.isWild,
        },
      ])
      .then((answers) => {
        if (answers.action === 'Fight') {
          if (answers.move === '--CANCEL--') return this.doBattle();
          else {
            const moveName = answers.move.split(' |')[0].trimEnd();
            const statusResult = this.doStatusEffect(this.playerPokemon, false);
            if (statusResult !== 'skip')
              this.fight(
                movesData[moveName],
                this.playerPokemon,
                this.opponentPokemon
              );
            this.doStatusEffect(this.playerPokemon, true);
            return this.resolveTurn();
          }
        }
        if (answers.action === 'Pokemon') {
          return this.choosePokemon(this.player).then((choice) => {
            if (choice) {
              this.doStatusEffect(this.playerPokemon, false);
              this.doStatusEffect(this.playerPokemon, true);
              return this.resolveTurn();
            } else return this.doBattle();
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
                  const defeatedPokemon = this.opponent.currentPokeball.storage;
                  return this.awardXp(defeatedPokemon).then(() =>
                    this.doEndOfBattle()
                  );
                } else if (result === 'cancel') return this.doBattle();
                else {
                  this.doStatusEffect(this.playerPokemon, false);
                  this.doStatusEffect(this.playerPokemon, true);
                  return this.resolveTurn();
                }
              });
          }
        }
        if (answers.action === 'Run') {
          if (!answers.runConfirm) return this.doBattle();
          if (!this.opponent.isWild) {
            return inquirer
              .prompt([
                {
                  type: 'input',
                  name: 'unableToRun',
                  message: 'Cannot run from a trainer battle!',
                },
              ])
              .then(() => this.doBattle());
          } else {
            const playerSpeed = this.playerPokemon.speed.current;
            const opponentSpeed = this.opponentPokemon.speed.current;
            const speedDifference = opponentSpeed - playerSpeed;
            const scalingFactor = 0.025;
            const runDifficulty =
              playerSpeed > opponentSpeed
                ? 0
                : 1 +
                  speedDifference * scalingFactor -
                  this.escapeAttempts * 0.75;
            const runChance = Math.random() + 0.5;
            const isRunSuccess = runChance >= runDifficulty;
            return inquirer
              .prompt([
                {
                  type: 'input',
                  name: 'runResult',
                  message: isRunSuccess
                    ? 'Successfully escaped from battle!'
                    : `The wild ${this.opponentPokemon.name} caught you! Escape failed.`,
                },
              ])
              .then(() => {
                if (isRunSuccess) {
                  this.isEscaped = true;
                  this.loser = this.opponent;
                  return this.doEndOfBattle();
                } else {
                  this.escapeAttempts++;
                  this.doStatusEffect(this.playerPokemon, false);
                  this.doStatusEffect(this.playerPokemon, true);
                  return this.resolveTurn();
                }
              });
          }
        }
      });
  }

  setNextPokemon(trainer) {
    if (!trainer.currentPokeball.storage.hitPoints.current) {
      for (let i = 0; i < trainer.pokemonList.length; i++) {
        const pokemon = trainer.getPokemon(trainer.pokemonList[i]).pokemonObj;
        const pokeball = trainer.belt.find((ball) => {
          return ball.storage.id === pokemon.id;
        });
        if (pokeball.storage && pokeball.storage.hitPoints.current) {
          trainer.currentPokeball = trainer.belt[i];
          this.opponentPokemon = this.opponent.currentPokeball.storage;
          this.playerPokemon = this.player.currentPokeball.storage;
          return true; // tells setCurrentPokeballs that this trainer hasValidPokemon (i.e. with > 0 hitPoints)
        }
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
    this.player.currentPokeball = this.player.belt.find(
      (ball) => ball.storage.name === this.player.pokemonList[0]
    );
    /////
    this.currentPlayerData.player = this.player;
    if (this.loser.isWild) {
      if (!this.isEscaped) console.log('\nYou won!');
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
    function runSequentialPromises(promises) {
      const results = [];
      return promises.reduce((prevPromise, nextPromise) => {
        return prevPromise.then(() =>
          nextPromise().then((result) => {
            results.push(result);
            return results;
          })
        );
      }, Promise.resolve());
    }

    const winningTrainer =
      defeatedPokemon === this.opponentPokemon ? this.player : this.opponent;

    if (winningTrainer === this.player) {
      const totalXpToAward = defeatedPokemon.level * 2;
      const shareOfXp = Math.max(
        1,
        Math.round(totalXpToAward / this.participatingPokemon.length)
      );
      const xpPromises = this.participatingPokemon.map(
        (pokemonIndex) => () =>
          this.player.belt[pokemonIndex].storage.addXp(shareOfXp)
      );
      return runSequentialPromises(xpPromises).then((evolutions) => {
        evolutions.forEach((evolvedForm, index) => {
          if (evolvedForm) {
            const beltIndex = this.participatingPokemon[index];
            const pokemonListIndex = this.player.pokemonList.findIndex(
              (pokeName) =>
                pokeName === this.player.belt[beltIndex].storage.name
            );
            this.player.pokemonList[pokemonListIndex] = evolvedForm.name;
            this.player.belt[beltIndex].storage = evolvedForm;
          }
        });
      });
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
    return Math.floor(Math.random() + 0.075);
  }

  resolveStatusMove(move, user, target) {
    function modBy50(stat, stagesToModBy) {
      const stageOfStat = stat / 4;
      return stat + stageOfStat * stagesToModBy;
    }
    let effectAlreadyApplied = false;
    const targetsSelf = target === user;
    const effect = targetsSelf ? move.effectOnSelf : move.effectOnTarget;
    const isEffectSuccess = Math.random() <= effect.statusChance;
    if (effect.status) {
      if (!isEffectSuccess) {
        if (!move.doesDamage)
          console.log(`${user.name}'s ${move.name} failed!`);
        return;
      } else {
        const activeStatus = Object.entries(target.activeEffects).find(
          (activeEffect) => activeEffect[1].status
        );
        const innerMessage =
          activeStatus?.[1]?.status === effect.status
            ? 'is already'
            : activeStatus
            ? `is no longer ${activeStatus[1].status}. ${target.name} is now`
            : 'is';
        console.log(`${target.name} ${innerMessage} ${effect.status}!`);
        if (activeStatus) delete target.activeEffects[activeStatus[0]];
        target.activeEffects[move.name] = effect;
        if (effect.status === 'asleep') {
          const sleepTurns = Math.round(Math.random() * 2 + 1);
          target.activeEffects[move.name].sleepTurns = sleepTurns;
        }
        if (effect.status === 'confused') {
          const confusedTurns = Math.round(Math.random() * 3 + 1);
          target.activeEffects[move.name].confusedTurns = confusedTurns;
        }
      }
    }
    if (
      effect.stat ||
      (isEffectSuccess &&
        (effect.status === 'paralysed' || effect.status === 'burning'))
    ) {
      if (Math.random() <= effect.statChance) return;
      const effectMessage =
        effect.modifier === 1
          ? 'rose!'
          : effect.modifier > 1
          ? 'rose sharply!'
          : effect.modifier === -1 || !effect.modifier
          ? 'fell!'
          : 'fell sharply!';

      const affectedStat =
        effect.status === 'paralysed'
          ? 'speed'
          : effect.status === 'burning'
          ? 'attack'
          : effect.stat;
      const statAfterMod = +modBy50(
        target[affectedStat].current,
        effect.modifier || -2
      ).toFixed(2);
      if (
        statAfterMod <= target[affectedStat].max * 0.25 ||
        statAfterMod <= target.level
      ) {
        console.log(
          `${target.name}'s ${affectedStat} is already too low. ${move.name} had no effect!`
        );
        return;
      }
      if (
        statAfterMod >= target[affectedStat].max * 1.75 ||
        statAfterMod >= 500
      ) {
        console.log(
          `${target.name}'s ${affectedStat} is already too high. ${move.name} had no effect!`
        );
        return;
      }
      target[affectedStat].current = statAfterMod;
      if (!['paralysed', 'burning'].includes(effect.status))
        target.activeEffects[move.name] = effect;
      effectAlreadyApplied = true;
      console.log(`${target.name}'s ${affectedStat} ${effectMessage}`);
    }
  }

  fight(move, attackingPokemon, defendingPokemon) {
    const attacker = attackingPokemon.name;
    const defender = defendingPokemon.name;
    let hasValidTarget = defendingPokemon.hitPoints.current > 0;
    let damage = attackingPokemon.useMove(move, defendingPokemon);
    // CALCULATE HIT CHANCE HERE

    if (move.effectOnSelf)
      this.resolveStatusMove(move, attackingPokemon, attackingPokemon);
    if (move.effectOnTarget)
      this.resolveStatusMove(move, attackingPokemon, defendingPokemon);
    if (!move.doesDamage) return;

    // Calculate attacking pokemon's damage,
    const isImmune = defendingPokemon.isImmuneTo(move);
    const effectiveness =
      0 +
      defendingPokemon.getWeakness(move) +
      defendingPokemon.getResistance(move);
    damage =
      effectiveness > 0
        ? (1 + 0.25 * Math.abs(effectiveness)) * damage
        : effectiveness < 0
        ? (1 - 0.25 * Math.abs(effectiveness)) * damage
        : isImmune
        ? 0
        : damage;
    // accounting for type weaknesses

    const isCriticalHit = this.getCriticalHit();
    if (isCriticalHit && !isImmune) damage = damage * 2;
    const finalDamage = +damage.toFixed(2);

    if (hasValidTarget) {
      // Deal damage to defending pokemon
      defendingPokemon.takeDamage(finalDamage);
      const defendingHitPointRatio =
        defendingPokemon.hitPoints.current / defendingPokemon.hitPoints.max;
      // and calculate how badly damaged it is now

      if (isImmune) console.log('It had no effect!');
      else {
        if (effectiveness > 0) console.log("It's super effective!");
        if (effectiveness < 0) console.log("It's not very effective...");
        if (isCriticalHit) console.log("It's a critical hit!");
      }

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

  doStatusEffect(pokemon, isEndOfTurn) {
    const effects = Object.entries(pokemon.activeEffects);

    const statusEffect = effects.find((effect) => effect[1].status);
    const status = statusEffect?.[1].status;
    const tickDamage = pokemon.hitPoints.max / 16;

    if (status === 'paralysed' && !isEndOfTurn) {
      const skipTurnChance = Math.random();
      if (skipTurnChance <= 0.25) {
        console.log(`${pokemon.name} is fully paralysed and can't attack!`);
        return 'skip';
      }
    }
    if (status === 'burning' && isEndOfTurn) {
      console.log(`${pokemon.name} is hurt by its burn!`);
      console.log(`${pokemon.name} took ${tickDamage} damage.`);
      pokemon.takeDamage(tickDamage);
    }
    if (status === 'poisoned' && isEndOfTurn) {
      console.log(`${pokemon.name} is hurt by poison!`);
      console.log(`${pokemon.name} took ${tickDamage} damage.`);
      pokemon.takeDamage(tickDamage);
    }
    if (status === 'asleep' && !isEndOfTurn) {
      if (pokemon.activeEffects[statusEffect[0]].sleepTurns) {
        pokemon.activeEffects[statusEffect[0]].sleepTurns -= 1;
        console.log(`${pokemon.name} is fast asleep!`);
        return 'skip';
      } else {
        console.log(`${pokemon.name} woke up!`);
        delete pokemon.activeEffects[statusEffect[0]];
      }
    }
    if (status === 'confused' && !isEndOfTurn) {
      if (pokemon.activeEffects[statusEffect[0]].confusedTurns) {
        pokemon.activeEffects[statusEffect[0]].confusedTurns -= 1;
        console.log(`${pokemon.name} is confused!`);
        const selfAttackChance = Math.random();
        if (selfAttackChance <= 0.5) {
          console.log(`It hurt itself in its confusion!`);
          const selfDamage = pokemon.useMove(
            movesData.confusionSelfAttack,
            pokemon
          );
          pokemon.takeDamage(selfDamage);
          console.log(`${pokemon.name} took ${selfDamage} damage.`);
          return 'skip';
        }
      } else {
        console.log(`${pokemon.name} is no longer confused!`);
        delete pokemon.activeEffects[statusEffect[0]];
      }
    }
  }
}

// const gerty = create.pokemon('Butterfree', 'PLAYER BUT', 15);
// const maude = create.pokemon('Weedle', 'Maude', 6);
// // console.log(
// //   'GERTY | current XP:',
// //   gerty.xp,
// //   'needed for next level:',
// //   gerty.xpThreshold - gerty.xp
// // );
// // console.log(
// //   'MAUDE | current XP:',
// //   maude.xp,
// //   'needed for next level:',
// //   maude.xpThreshold - maude.xp
// // );
// // gerty.xp = 595;
// // maude.xp = 85;

// const sq1 = create.pokemon('Squirtle', 'sq1', 6);
// const sq2 = create.pokemon('Squirtle', 'sq2', 6);
// const sq3 = create.pokemon('Squirtle', 'sq3', 6);
// const sq4 = create.pokemon('Squirtle', 'sq4', 6);
// const jeb = new Player('Jebediah', [gerty, maude, sq1, sq2, sq3, sq4]);

// const phil = create.pokemon('Weedle', 'Phil', 5);
// const paula = create.pokemon('Butterfree', 'Paula', 5);
// const butch = new Trainer('Butch', [phil, paula]);

// const wild = randomWildPokemon(15, 'Geodude');
// jeb.inventory['Poke Ball'] = 3;
// jeb.inventory['Great Ball'] = 1;
// jeb.inventory['Full Restore'] = 2;
// jeb.inventory['Antidote'] = 1;

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
//     return testBattle.startBattle();
//   })
//   .then(({ currentPlayerData }) => {});

module.exports = { Battle };
