const inquirer = require('inquirer');
const fs = require('fs/promises');
const create = require('../data/create');
const loadGame = require('../load-game.js');
const { saveGame } = require('../save-game');
const { itemsData } = require('../data/items-data.js');
const { townsData } = require('../data/towns-data');
const { Player } = require('../trainers/player');
const { showMenu } = require('./menu');

let currentPlayerData;
let currentRivalData;
let pokeMartStock;
let currentTownName;

function randomWelcomeMessage() {
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
  const welcomesLength = welcomeMessages.length;
  const randomWelcomeIndex = Math.round(Math.random() * welcomesLength - 1);
  const welcomeIndex = Math.max(randomWelcomeIndex, 0);

  return welcomeMessages[welcomeIndex];
}

function enterTown(playerData, rivalData, townName) {
  currentPlayerData = playerData;
  currentRivalData = rivalData;
  const welcomeMessage = randomWelcomeMessage();
  const customWelcome = welcomeMessage.replace('%T', townName);
  console.log(customWelcome);
  console.log('\n', townsData[townName].nameArt, '\n');
  currentPlayerData.townsVisited.push(townName);
  return exploreTown();
}

function exploreTown() {
  return inquirer
    .prompt([
      {
        type: 'list',
        name: 'townAction',
        message: `Where would you like to go?`,
        choices: [
          'Walk around',
          'Poke Mart',
          'Pokemon Centre',
          'Menu',
          '--LEAVE--',
        ],
      },
    ])
    .then((answers) => {
      if (answers.townAction === 'Walk around') {
        console.log('\n== TOWN EVENTS NOT YET IMPLEMENTED ==\n');
        return exploreTown();
      } else if (answers.townAction === 'Poke Mart') {
        return pokeMart();
      } else if (answers.townAction === 'Pokemon Centre') {
        return pokemonCentre();
      } else if (answers.townAction === 'Menu') {
        return showMenu(currentPlayerData, currentRivalData).then(
          (isQuitGame) => (isQuitGame ? 'quit' : exploreTown())
        );
      } else if (answers.townAction === '--LEAVE--') {
        const playerData = currentPlayerData;
        const rivalData = currentRivalData;
        return Promise.all([
          saveGame({ playerData, rivalData }),
          playerData,
          rivalData,
        ]);
      }
    });
}

function pokeMart() {
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
        return exploreTown();
      } else if (answers.pokeMart === 'Talk') {
        console.log('\n== POKE MART EVENTS NOT YET IMPLEMENTED ==\n');
        return pokeMart();
      } else if (answers.pokeMart === 'Buy') {
        return buy();
      } else if (answers.pokeMart === 'Sell') {
        return sell();
      }
    });
}

function pokemonCentre() {
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
        return exploreTown();
      } else if (answers.pokemonCentre === 'Talk') {
        console.log('\n== POKEMON CENTRE EVENTS NOT YET IMPLEMENTED ==\n');
        return pokemonCentre();
      } else if (answers.pokemonCentre === 'Heal Pokemon') {
        healPokemon();
        return pokemonCentre();
      } else if (answers.pokemonCentre === 'Use PC') {
        return usePC();
      }
    });
}

function buy(alreadyBought) {
  const items = Object.values(itemsData).filter(
    (item) => item.type !== 'money'
  );
  const stock = pokeMartStock || [];
  if (!stock[0]) {
    items.forEach((item) => {
      const random = Math.round(Math.random() * 10);
      const randomQuantity = Math.max(0, random - item.rarity);
      const { stageToLoad } = currentPlayerData;
      const loopNum = +stageToLoad.charAt(stageToLoad.length - 1);
      const quantity = loopNum >= item.rarity ? randomQuantity : 0;
      if (quantity)
        stock.push(
          `${item.name}: x${quantity} (${item.price}₽) - ${item.description}`
        );
    });
  }
  const inventory = currentPlayerData.player.inventory;

  return inquirer
    .prompt([
      {
        type: 'list',
        name: 'item',
        message: `
What would you like to buy?
You have ${inventory['Money']}₽.`,
        choices: [...stock, '--CANCEL--'],
        when: () => !alreadyBought,
      },
      {
        type: 'list',
        name: 'item',
        message: `
Would you like to buy something else?
You have ${inventory['Money']}₽.`,
        choices: [...stock, '--CANCEL--'],
        when: () => alreadyBought,
      },
      {
        type: 'input',
        name: 'quantity',
        message: ({ item }) => {
          const itemName = item.split(':')[0];
          const playerQuantity = inventory[itemName] || 0;
          return `
You currently have ${playerQuantity}.
You have ${inventory['Money']}₽.
How many ${itemName}s would you like to buy? Enter quantity:`;
        },
        when: ({ item }) => item !== '--CANCEL--',
      },
    ])
    .then(({ item, quantity }) => {
      const itemName = item.split(':')[0].replace('\n', '');
      const itemNamePlural = quantity > 1 ? itemName + 's' : itemName;
      const itemPrice = item === '--CANCEL--' ? 0 : item.match(/\d+/g)[1];
      const itemQuantity = item === '--CANCEL--' ? 0 : item.match(/\d+/g)[0];
      const totalCost = quantity === '--CANCEL--' ? 0 : itemPrice * quantity;

      if (item === '--CANCEL--' || !quantity) {
        pokeMartStock = stock;
        console.log('\nYou leave the Poke Mart.\n');
        return exploreTown();
      } else if (+quantity > +itemQuantity) {
        console.log(
          `\nWe don't have that many! You wanted to buy ${quantity} ${itemNamePlural}, but we only have ${itemQuantity} available.\n`
        );
        return buy();
      } else if (totalCost > inventory['Money']) {
        console.log(
          `\nYou don't have enough money! Buying ${quantity} ${itemNamePlural} would cost ${totalCost}₽, but you only have ${inventory['Money']}₽\n`
        );
        return buy();
      } else {
        currentPlayerData.player.inventory['Money'] -= totalCost;
        if (!inventory[itemName])
          currentPlayerData.player.inventory[itemName] = 0;
        currentPlayerData.player.inventory[itemName] += +quantity;
        const stockQuantity = item.match(/\d+/g)[0];
        const updatedQuantity = (+stockQuantity - quantity).toString();
        const updatedItem = item.replace(stockQuantity, updatedQuantity);
        if (!+updatedQuantity) stock.splice(stock.indexOf(item), 1);
        else stock[stock.indexOf(item)] = updatedItem;
        pokeMartStock = stock;
        return buy(true);
      }
    });
}

function sell(alreadySold) {
  const inventory = currentPlayerData.player.inventory;
  const items = Object.entries(inventory).filter((item) => item[0] !== 'Money');
  const playerStock = items.map((item) => {
    const itemName = item[0];
    const itemQuantity = item[1];
    const itemPrice = itemsData[itemName].price;
    const itemDescription = itemsData[itemName].description;
    return `${itemName}: x${itemQuantity} (${itemPrice}₽) - ${itemDescription}`;
  });

  return inquirer
    .prompt([
      {
        type: 'list',
        name: 'item',
        message: `
  What would you like to sell?
  You have ${inventory['Money']}₽.`,
        choices: [...playerStock, '--CANCEL--'],
        when: () => !alreadySold,
      },
      {
        type: 'list',
        name: 'item',
        message: `
  Would you like to sell something else?
  You have ${inventory['Money']}₽.`,
        choices: [...playerStock, '--CANCEL--'],
        when: () => alreadySold,
      },
      {
        type: 'input',
        name: 'quantity',
        message: ({ item }) => {
          const itemName = item.split(':')[0];
          const playerQuantity = inventory[itemName] || 0;
          return `
  How many would you like to sell? [${item}]
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
      const playerQuantity = inventory[itemName] || 0;
      const totalCost = quantity === '--CANCEL--' ? 0 : itemPrice * quantity;

      if (item === '--CANCEL--' || quantity === '--CANCEL--') {
        console.log('\nYou leave the Poke Mart.\n');
        return exploreTown();
      } else if (+quantity > playerQuantity) {
        console.log(
          `\nYou don't have that many! You wanted to sell ${quantity} ${itemNamePlural}, but you only have ${itemQuantity} available.\n`
        );
        return sell();
      } else {
        currentPlayerData.player.inventory['Money'] += totalCost;
        currentPlayerData.player.inventory[itemName] -= +quantity;
        if (currentPlayerData.player.inventory[itemName] === 0)
          delete currentPlayerData.player.inventory[itemName];

        const itemInPokeMartStock = pokeMartStock.find((item) =>
          item.startsWith(itemName)
        );
        const stockQuantity = itemInPokeMartStock.match(/\d+/g)[0];
        const updatedQuantity = (+stockQuantity + +quantity).toString();
        const updatedItem = itemInPokeMartStock.replace(
          stockQuantity,
          updatedQuantity
        );
        pokeMartStock[pokeMartStock.indexOf(itemInPokeMartStock)] = updatedItem;
        return sell(true);
      }
    });
}

function usePC() {
  return inquirer
    .prompt([
      {
        type: 'list',
        name: 'action',
        message: `What would you like to do with the PC?`,
        choices: [
          'Read mail',
          'Store Pokemon',
          'Withdraw Pokemon',
          '--CANCEL--',
        ],
      },
    ])
    .then(({ action }) => {
      if (action === '--CANCEL--') {
        console.log('\nYou turn off the PC.\n');
        return pokemonCentre();
      } else if (action === 'Read Mail') {
        console.log('\n== PC MAIL EVENTS NOT YET IMPLEMENTED ==\n');
        return usePC();
      } else if (action === 'Store Pokemon') {
        return storePokemon();
      } else if (action === 'Withdraw Pokemon') {
        return withdrawPokemon();
      }
    });
}

function storePokemon() {
  const { player } = currentPlayerData;
  const { pokemonList } = player;
  const pokemonChoices = pokemonList.map((pokeName) => {
    const pokemon = player.getPokemon(pokeName).pokemonObj;
    const pokemonWithHp = `${pokeName}: Level ${pokemon.level} | HP - ${pokemon.hitPoints.current}/${pokemon.hitPoints.max}`;
    return !pokemon.hitPoints.current
      ? `${pokemonWithHp} - unconscious`
      : pokemonWithHp;
  });
  return inquirer
    .prompt([
      {
        type: 'list',
        name: 'pokemon',
        message: `
  Which Pokemon would you like to store?
  Stored Pokemon can be retrieved from the PC in any town's Pokemon Centre.`,
        choices: [...pokemonChoices, '--CANCEL--'],
      },
    ])
    .then(({ pokemon }) => {
      if (pokemon === '--CANCEL--') {
        return usePC();
      } else if (player.belt.length === 1) {
        console.log(
          `\nThis Pokemon can't be stored because it's your only Pokemon. 
You need at least one Pokemon to travel safely!\n`
        );
        return usePC();
      } else {
        const pokemonName = pokemon.split(':')[0];
        const ballIndex = player.belt.findIndex(
          (ball) => ball.storage.name === pokemonName
        );
        const pokemonListIndex = player.pokemonList.findIndex(
          (pokemonListName) => pokemonListName === pokemonName
        );
        pokemonList.splice(pokemonListIndex, 1);
        const ball = player.belt.splice(ballIndex, 1)[0];
        if (ball === player.currentPokeball)
          player.currentPokeball = player.belt.find((ball) => ball.storage);
        currentPlayerData.PC.push(ball);
        return usePC();
      }
    });
}

function withdrawPokemon() {
  const { player, PC } = currentPlayerData;
  const pokemonChoices = PC.map(({ storage }) => {
    const pokemon = storage;
    const pokemonWithHp = `${pokemon.name}: Level ${pokemon.level} | HP - ${pokemon.hitPoints.current}/${pokemon.hitPoints.max}`;
    return !pokemon.hitPoints.current
      ? `${pokemonWithHp} - unconscious`
      : pokemonWithHp;
  });
  return inquirer
    .prompt([
      {
        type: 'list',
        name: 'pokemon',
        message: `
  Which Pokemon would you like to withdraw?
  You can take up to 6 Pokemon with you.`,
        choices: [...pokemonChoices, '--CANCEL--'],
      },
    ])
    .then(({ pokemon }) => {
      if (pokemon === '--CANCEL--') {
        return usePC();
      } else if (player.belt.length === 6) {
        console.log(`
You already have 6 Pokemon! 
You should store a Pokemon first to make room.`);
        return storePokemon();
      } else {
        const pokemonName = pokemon.split(':')[0];
        const ballIndex = PC.findIndex(
          (ball) => ball.storage.name === pokemonName
        );
        const ball = PC.splice(ballIndex, 1)[0];
        player.belt.push(ball);
        player.pokemonList.push(pokemonName);
        return usePC();
      }
    });
}

function healPokemon() {
  console.log(
    '\nNurse: Thank you! Your Pokemon are fighting fit! We hope to see you again!\n'
  );
  currentPlayerData.player.belt.forEach((ball) => {
    const poke = ball.storage;
    // poke.hitPoints.current = poke.hitPoints.max;
    // poke.attack.current = poke.attack.max;
    // poke.defence.current = poke.defence.max;
    // for (const effect in poke.activeEffects) {
    //   if (!poke.activeEffects[effect].permanent)
    //     delete poke.activeEffects[effect];
    // }
    poke.healToFull();
  });
}

module.exports = { enterTown };
