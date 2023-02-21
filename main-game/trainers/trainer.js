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

  resolveItem(item, target) {
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
          this.belt.push(ball);
          this.pokemonList.push(`${capturedPokemon.name}`);
        } else {
          console.log(
            `You already have 6 Pokemon! You will have to send one Pokemon to your PC storage.`
          );
        }

        const pokemonChoices = this.pokemonList.map((pokeName) => {
          const pokemon = this.getPokemon(pokeName).pokemonObj;
          const pokemonWithHp = `${pokeName}: Level ${pokemon.level} | HP - ${pokemon.hitPoints.current}/${pokemon.hitPoints.max}`;

          return !pokemon.hitPoints.current
            ? `${pokemonWithHp} - unconscious`
            : pokemon.name === this.currentPokeball.storage.name
            ? `${pokemonWithHp} - in battle`
            : pokemonWithHp;
        });

        pokemonChoices.unshift(
          `${capturedPokemon.name}: Level ${capturedPokemon.level} | HP - ${capturedPokemon.hitPoints.current}/${capturedPokemon.hitPoints.max} - new`
        );

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
                if (answers.pokemonName) {
                  pokemonChoices[0] = pokemonChoices[0].replace(
                    capturedPokemon.name,
                    answers.pokemonName
                  );
                }
                // only ask this question if there wasn't space to add the pokemon to belt
                return !hasSpace;
              },
            },
          ])
          .then((answers) => {
            if (answers.pokemonName) capturedPokemon.name = answers.pokemonName;
            if (answers.pokemonToStore) {
              const selectedPokemon = answers.pokemonToStore.split(':')[0];
              const selectedPokemonIndex =
                this.getPokemon(selectedPokemon).index;

              if (selectedPokemon === capturedPokemon.name) {
                // SEND NEWLY CAPTURED POKEMON TO PC
                // captured pokemon name temporarily unshifted onto this.pokemonList in line 68, make sure pokemonList is updated to reflect new lineup. New pokemon should probably be last?
              } else {
                this.belt[selectedPokemonIndex].storage = capturedPokemon;
                // SEND SELECTED POKEMON TO PC
                // deal with pokemonList as detailed above
              }
            }
            return capturedPokemon;
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
    }
  }
}

module.exports = { Trainer };
