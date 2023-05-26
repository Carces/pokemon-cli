const { itemsData } = require('../../main-game/data/items-data.js');
const create = require('../data/create.js');
const inquirer = require('inquirer');

class Trainer {
  constructor(name, pokemonArr) {
    this.name = name;
    this.belt = [];
    this.pokemonArr = pokemonArr;
    this.pokemonList = [];
    if (pokemonArr) {
      for (let i = 0; i < this.pokemonArr.length; i++) {
        this.belt.push(create.ball('Poke Ball'));
        this.belt[i].storage = this.pokemonArr[i];
      }
      this.pokemonList = pokemonArr.map((pokemon) => pokemon.name);
    }
    this.currentPokeball = this.belt[0];
    this.isPlayer = false;
    this.inventory = {
      Money: 500,
    };
  }

  getPokemon(pokeName) {
    for (let i = 0; i < this.belt.length; i++) {
      if (this.belt[i].storage && this.belt[i].storage.name === pokeName) {
        return { pokemonObj: this.belt[i].storage, index: i };
      }
    }
    console.log(`${this.name} doesn't have a pokemon called ${pokeName}`);
  }

  buyItem(item, quantity = 1) {
    const price = itemsData[item].price;
    if (price * quantity > this.inventory.money) {
      console.log(`Not enough money!`);
      return null;
    }

    this.inventory.money -= price * quantity;
    if (this.inventory[item]) this.inventory[item] += quantity;
    else this.inventory[item] = quantity;

    return itemsData[item];
  }

  getPokemonChoices(isBattleChoose, isSendingToPC, capturedPokemon) {
    const nameList = this.pokemonList;
    if (isSendingToPC) nameList.unshift(capturedPokemon.name);
    const namePadding = [...nameList].sort((a, b) => b.length - a.length)[0]
      .length;
    const levelPadding = [...nameList].sort((a, b) => {
      const bLevel =
        b === capturedPokemon?.name
          ? capturedPokemon.level
          : this.getPokemon(b).pokemonObj.level;
      const aLevel =
        a === capturedPokemon?.name
          ? capturedPokemon.level
          : this.getPokemon(a).pokemonObj.level;
      return bLevel - aLevel;
    })[0].length;

    const pokemonChoices = this.pokemonList.map((pokeName) => {
      const isCapturedPoke = pokeName === capturedPokemon?.name;
      const pokemon = isCapturedPoke
        ? capturedPokemon
        : this.getPokemon(pokeName).pokemonObj;
      const paddedName = `${pokeName}:`.padEnd(namePadding + 1);
      const pokemonWithHp = `${paddedName} Level ${pokemon.level
        .toString()
        .padEnd(levelPadding)} | HP - ${pokemon.hitPoints.current}/${
        pokemon.hitPoints.max
      }`;
      const pokemonConditions = [];
      Object.values(pokemon.activeEffects).forEach((effect) => {
        if (effect.status && !pokemonConditions.includes(effect.status))
          pokemonConditions.push(effect.status);
      });
      const pokemonChoice = isCapturedPoke
        ? `${pokemonWithHp} - NEW`
        : !pokemon.hitPoints.current && isBattleChoose
        ? { name: pokemonWithHp, disabled: 'unconscious' }
        : !pokemon.hitPoints.current
        ? `${pokemonWithHp} - unconscious`
        : pokemon.id === this.currentPokeball.storage.id && isBattleChoose
        ? { name: pokemonWithHp, disabled: 'already out' }
        : pokemonWithHp;
      return pokemonConditions[0]
        ? `${pokemonChoice} (${pokemonConditions})`
        : pokemonChoice;
    });
    // if (isSendingToPC)
    //   pokemonChoices.unshift(
    //     `${capturedPokemon.name}: Level ${capturedPokemon.level} | HP - ${capturedPokemon.hitPoints.current}/${capturedPokemon.hitPoints.max} - new`
    //   );
    return pokemonChoices;
  }

  useItem(item, trainer, opponent, opponentPokemon, currentPlayerData) {
    const itemData = itemsData[item];
    const pokemonChoices = this.getPokemonChoices();
    const targets =
      itemData.type === 'ball' && opponent?.isWild
        ? [opponentPokemon]
        : itemData.type === 'ball'
        ? [{ name: ' ', disabled: 'Only wild Pokemon can be caught!' }]
        : ['boost', 'heal', 'remove'].includes(itemData.type)
        ? pokemonChoices
        : [{ name: ' ', disabled: 'No valid targets!' }];
    targets.push('--CANCEL--');

    return inquirer
      .prompt([
        {
          type: 'list',
          name: 'target',
          message: `Choose a target for your ${item}`,
          choices: targets,
        },
      ])
      .then((answers) => {
        if (answers.target === '--CANCEL--') return 'cancel';
        else {
          const selectedPokemon = answers.target.split(':')[0];
          if (selectedPokemon === opponentPokemon?.name) {
            console.log(`${trainer.name} used ${item} on ${selectedPokemon}!`);
            return this.resolveItem(
              item,
              opponentPokemon,
              currentPlayerData.PC
            );
          } else {
            const selectedPokemonObj =
              trainer.getPokemon(selectedPokemon).pokemonObj;
            console.log(`${trainer.name} used ${item} on ${selectedPokemon}!`);
            return this.resolveItem(
              item,
              selectedPokemonObj,
              currentPlayerData.PC
            );
          }
        }
      });
  }

  resolveItem(item, target, PC) {
    function modBy50(stat, stagesToModBy) {
      const stageOfStat = stat / 5;
      return stat + stageOfStat * stagesToModBy;
    }
    const itemData = itemsData[item];
    const effect = itemData.effect;

    this.inventory[item]--;
    if (this.inventory[item] === 0) delete this.inventory[item];

    if (itemData.type === 'ball') {
      const ball = create.ball(itemData.name);
      const capturedPokemon = ball.throw(target);
      if (capturedPokemon) {
        let hasSpace = false;
        if (this.belt.length < 6) {
          hasSpace = true;
        } else {
          console.log(
            `You already have 6 Pokemon! You will have to send one Pokemon to your PC storage.`
          );
        }
        let pokemonChoices = [];

        return inquirer
          .prompt([
            {
              type: 'confirm',
              name: 'confirmName',
              message: `Would you like to give your new ${capturedPokemon.species} a name?`,
              default: false,
            },
            {
              type: 'input',
              name: 'pokemonName',
              message: `What will its new name be?`,
              default: capturedPokemon.species,
              when: (answers) => answers.confirmName,
            },
            {
              type: 'list',
              name: 'pokemonToStore',
              message: `Which Pokemon should be sent to the computer?`,
              choices: pokemonChoices,
              when: (answers) => {
                // update pokemonChoices with the new name that was just entered
                if (answers.pokemonName)
                  capturedPokemon.name = answers.pokemonName;
                const storeChoices = this.getPokemonChoices(
                  false,
                  true,
                  capturedPokemon
                );
                pokemonChoices.splice(
                  0,
                  pokemonChoices.length,
                  ...storeChoices
                );
                // only ask this question if there wasn't space to add the pokemon to belt
                return !hasSpace;
              },
            },
          ])
          .then((answers) => {
            if (answers.pokemonName) capturedPokemon.name = answers.pokemonName;
            if (answers.pokemonToStore) {
              const selectedPokemon = answers.pokemonToStore.split(':')[0];
              const selectedPokemonBallIndex =
                selectedPokemon === capturedPokemon.name
                  ? null
                  : this.getPokemon(selectedPokemon).index;

              if (selectedPokemon === capturedPokemon.name) {
                PC.push(ball);
              } else {
                const pokemonListIndex = this.pokemonList.findIndex(
                  (pokemonListName) => pokemonListName === selectedPokemon
                );
                this.pokemonList.splice(
                  pokemonListIndex,
                  1,
                  capturedPokemon.name
                );
                const ballToReplace = this.belt[selectedPokemonBallIndex];
                PC.push(ballToReplace);
                this.belt.splice(selectedPokemonBallIndex, 1, ball);
              }
            } else {
              this.pokemonList.push(capturedPokemon.name);
              this.belt.push(ball);
            }
            return 'captureSuccess';
          });
      } else return Promise.resolve(false);
    } else if (itemData.type === 'heal') {
      target.hitPoints.current = +Math.min(
        target.hitPoints.max,
        target.hitPoints.current + effect.modifier
      ).toFixed(2);
      console.log(
        `${target.name} regained ${effect.modifier} hit points! ${target.name} now has ${target.hitPoints.current}/${target.hitPoints.max} HP`
      );
      return Promise.resolve();
    } else if (itemData.type === 'boost') {
      const effectMessage = effect.modifier === 1 ? 'rose!' : 'rose sharply!';
      const statAfterMod = +modBy50(
        target[effect.stat.max].current,
        effect.modifier
      ).toFixed(2);

      if (
        statAfterMod >= target[effect.stat.max] * 1.5 ||
        statAfterMod >= 500
      ) {
        console.log(
          `${target.name}'s ${effect.stat} is already too high. ${item} had no effect!`
        );
      } else {
        target[effect.stat].current = statAfterMod;
        target.activeEffects[item] = effect;
        console.log(`${target.name}'s ${effect.stat} ${effectMessage}`);
      }
      return Promise.resolve();
    } else if (itemData.type === 'remove') {
      let effectRemoved = false;
      for (const activeEffect in target.activeEffects) {
        const activeEffObj = target.activeEffects[activeEffect];
        if (
          activeEffObj.status === effect.remove ||
          (activeEffObj.status && effect.remove === 'all')
        ) {
          delete target.activeEffects[activeEffect];
          effectRemoved = true;
        }
      }
      console.log(
        effectRemoved
          ? `${target.name} is no longer ${effect.remove}.`
          : `It had no effect! ${target.name} is not ${effect.remove}.`
      );
      return Promise.resolve();
    }
  }
}

module.exports = { Trainer };
