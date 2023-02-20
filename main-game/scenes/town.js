const inquirer = require('inquirer');
const fs = require('fs/promises');
const create = require('../data/create');
const loadGame = require('../load-game.js');
const { itemsData } = require('../data/items-data.js');
const { townsData } = require('../data/towns-data');
const { Player } = require('../trainers/player');

let currentPlayerData;

const welcomeMessages = [
  'After a long journey, you finally arrive at %T.',
  'As the sun crests over the horizon, you see the buildings of %T before you.',
  'In the fading evening light, you can see the lights of %T blinking on, one by one.',
  'The rumble of thunder fills the sky, and you run for the cover of %T just as rain begins to fall.',
  'You see the Poke Mart logo ahead, and check your map. Ah, this must be %T.',
  'The sounds of conversation drift towards on you on the wind as you approach %T.',
  'Up ahead, you see %T.',
  'In front of you lies %T.',
  'At last, a chance to restock your items and heal your Pokemon! %T lies ahead.',
  'Your feet sore from walking, you finally reach %T.',
  'The bustling streets of %T have plenty of places to eat, rest and shop.',
  'You see a town ahead and consult the map. Apparently, this is %T!',
  'Here it is, %T!',
  'Finally, %T!',
  'You begin to lower your guard as the wilderness turns to civilisation. %T is just up the road.',
  'The areas of long grass grow more and more infrequent as you approach %T.',
  "Is that it? ... Yes! It's %T!",
  'You take in the sights as you arrive in %T',
  'Just as it feels like you might never see a town again, you reach %T',
  'The safety of %T beckons.',
  'At last, %T!',
  'A distant Pokemon call echoes across the landscape as you catch your first glimpse of %T.',
  'Here we are, %T.',
  'As the fog clears, you catch sight of %T ahead.',
  'Tired and hungry, you feel relieved to finally see the outskirts of %T.',
  'The rooftops of %T provide welcome shade from the sweltering heat on the road.',
  'First, you see drifts of smoke twisting in the sky, then %T reveals itself.',
  'As the last of the daylight fades, the thought of a warm bed pushes you on until you reach %T.',
  'Your first visit to %T. Exciting!',
  "%T! Isn't it beautiful? Maybe you can send some postcards.",
  "The pictures don't do %T justice, it's much nicer in person!",
  "You've always wanted to visit %T, and now you're finally here!",
  'Ah, %T at last.',
  'Ah, %T. Just in time.',
  "A town! let's see now, is this %T? It must be!",
  "What's that up the road? It must be %T!",
  'Phew, that took a while. %T here we come.',
  "There's our destination, %T.",
  'Oh look, %T. Your Pokemon could probably do with a break.',
  '%T. Maybe you should have a look around the shops?',
  'Your stomach rumbles. Hm, maybe you should stop in %T for lunch.',
];

function randomTown() {
  const unvisitedTownNames = Object.entries(townsData)
    .filter((town) => !town[1].visited)
    .map((unvisitedTown) => unvisitedTown[0]);
  const townsLength = unvisitedTownNames.length;
  const randomTownIndex = Math.round(Math.random() * townsLength - 1);
  const townIndex = Math.max(randomTownIndex, 0);
  const welcomesLength = welcomeMessages.length;
  const randomWelcomeIndex = Math.round(Math.random() * welcomesLength - 1);
  const welcomeIndex = Math.max(randomWelcomeIndex, 0);

  return {
    townName: unvisitedTownNames[townIndex],
    welcomeMessage: welcomeMessages[welcomeIndex],
  };
}

function enterTown(playerData) {
  currentPlayerData = playerData;
  const { townName, welcomeMessage } = randomTown();
  const customWelcome = welcomeMessage.replace('%T', townName);
  console.log(customWelcome);
  console.log('\n', townsData[townName].nameArt, '\n');
  return Promise.all([exploreTown(townName), townName]);
}

function exploreTown(townName, pokeMartStock, alreadyBought) {
  return inquirer
    .prompt([
      {
        type: 'list',
        name: 'townAction',
        message: `Where would you like to go?`,
        choices: ['Walk around', 'Poke Mart', 'Pokemon Centre', '--LEAVE--'],
      },
    ])
    .then((answers) => {
      if (answers.townAction === 'Walk around') {
        console.log('\n== TOWN EVENTS NOT YET IMPLEMENTED ==\n');
        return exploreTown(townName);
      } else if (answers.townAction === 'Poke Mart') {
        return pokeMart(townName, pokeMartStock, alreadyBought);
      } else if (answers.townAction === 'Pokemon Centre') {
        return pokemonCentre();
      } else if (answers.townAction === '--LEAVE--') {
        return;
      }
    });
}

function pokeMart(townName, pokeMartStock, alreadyBought) {
  return inquirer
    .prompt([
      {
        type: 'list',
        name: 'pokeMart',
        message: `You enter the Poke Mart. What would you like to do?`,
        choices: ['Talk', 'Buy', 'Sell', '--LEAVE--'],
      },
    ])
    .then((answers) => {
      if (answers.pokeMart === '--LEAVE--') {
        console.log('\nYou leave the Poke Mart.\n');
        return exploreTown(townName);
      } else if (answers.pokeMart === 'Talk') {
        console.log('\n== POKE MART EVENTS NOT YET IMPLEMENTED ==\n');
        return pokeMart(townName);
      } else if (answers.pokeMart === 'Buy') {
        return buy(townName, pokeMartStock, alreadyBought);
      } else if (answers.pokeMart === 'Sell') {
        return sell(townName);
      }
    });
}

function pokemonCentre(townName) {
  return inquirer
    .prompt([
      {
        type: 'list',
        name: 'pokemonCentre',
        message: `You enter the Pokemon Centre. What would you like to do?`,
        choices: ['Talk', 'Heal Pokemon', 'Use PC', '--LEAVE--'],
      },
    ])
    .then((answers) => {
      if (answers.pokemonCentre === '--LEAVE--') {
        console.log('\nYou leave the Pokemon Centre.\n');
        return exploreTown(townName);
      } else if (answers.pokemonCentre === 'Talk') {
        console.log('\n== POKEMON CENTRE EVENTS NOT YET IMPLEMENTED ==\n');
        return pokemonCentre(townName);
      } else if (answers.pokemonCentre === 'Heal Pokemon') {
        healPokemon();
        return pokemonCentre(townName);
      } else if (answers.pokemonCentre === 'Use PC') {
        return usePC(townName);
      }
    });
}

function buy(townName, stock, alreadyBought) {
  const items = Object.values(itemsData).filter(
    (item) => item.type !== 'money'
  );
  const pokeMartStock = stock || [];
  if (!stock)
    items.forEach((item) => {
      const random = Math.round(Math.random() * 10);
      const randomQuantity = Math.max(0, random - item.rarity);
      const quantity =
        currentPlayerData.progressLevel >= item.rarity ? randomQuantity : 0;
      if (quantity)
        pokeMartStock.push(`
${item.name}: x${quantity} (${item.price}₽)
- ${item.description}`);
    });
  const inventory = currentPlayerData.player.inventory;

  return inquirer
    .prompt([
      {
        type: 'list',
        name: 'item',
        message: `
What would you like to buy?
You have ${inventory['Money']}₽.`,
        choices: [...pokeMartStock, '--CANCEL--'],
        when: () => !alreadyBought,
      },
      {
        type: 'list',
        name: 'item',
        message: `
Would you like to buy something else?
You have ${inventory['Money']}₽.`,
        choices: [...pokeMartStock, '--CANCEL--'],
        when: () => alreadyBought,
      },
      {
        type: 'input',
        name: 'quantity',
        message: ({ item }) => {
          const itemName = item.split(':')[0];
          const playerQuantity = inventory[itemName] || 0;
          return `
How many would you like to buy? [${item}]
You currently have ${playerQuantity}.
You have ${inventory['Money']}₽.`;
        },
        when: (answers) => answers.item !== '--CANCEL--',
      },
    ])
    .then(({ item, quantity }) => {
      const itemName = item.split(':')[0].replace('\n', '');
      const itemNamePlural = quantity > 1 ? itemName + 's' : itemName;
      const itemPrice = item === '--CANCEL--' ? 0 : item.match(/\d+/g)[1];
      const totalCost = quantity === '--CANCEL--' ? 0 : itemPrice * quantity;

      if (item === '--CANCEL--' || quantity === '--CANCEL--') {
        console.log('\nYou leave the Poke Mart.\n');
        return exploreTown(townName, pokeMartStock, alreadyBought);
      } else if (totalCost > inventory['Money']) {
        console.log(
          `You don't have enough money! Buying ${quantity} ${itemNamePlural} would cost ${totalCost}₽, but you only have ${inventory['Money']}₽`
        );
        return buy(townName, pokeMartStock);
      } else {
        currentPlayerData.player.inventory['Money'] -= totalCost;
        if (!inventory[itemName])
          currentPlayerData.player.inventory[itemName] = 0;
        currentPlayerData.player.inventory[itemName] += +quantity;
        const stockQuantity = item.match(/\d+/g)[0];
        const updatedQuantity = (+stockQuantity - 1).toString();
        const updatedItem = item.replace(stockQuantity, updatedQuantity);
        pokeMartStock[pokeMartStock.indexOf(item)] = updatedItem;
        alreadyBought = true;
        return buy(townName, pokeMartStock, alreadyBought);
      }
    });
}

function sell(townName) {}

function usePC(townName) {}

function healPokemon() {}

module.exports = { enterTown };
