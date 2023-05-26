const inquirer = require('inquirer');
const fs = require('fs/promises');
const create = require('../data/create');
const loadGame = require('../load-game.js');
const { saveGame } = require('../save-game');
const { itemsData } = require('../data/items-data.js');
const { townsData } = require('../data/towns-data');
const { Player } = require('../trainers/player');

let currentPlayerData;
let currentRivalData;
let currentMenu;

function showMenu(playerData, rivalData) {
  if (playerData) currentPlayerData = playerData;
  if (rivalData) currentRivalData = rivalData;

  const { inventory } = currentPlayerData.player;
  const inventoryEntries = Object.entries(inventory).filter(
    (itemEntry) => itemEntry[0] !== 'Money'
  );
  const itemChoices = inventoryEntries.map((itemEntry) =>
    itemEntry[0].endsWith('Ball')
      ? {
          name: `${itemEntry[0]}: ${itemEntry[1]}`,
          disabled: 'Cannot be used outside of battle.',
        }
      : `${itemEntry[0]}: ${itemEntry[1]}`
  );
  const menuOptions = [
    {
      type: 'list',
      name: 'menuAction',
      message: `Choose an action`,
      choices: ['Items', 'Pokemon', 'Save', 'Quit', '--EXIT MENU--'],
      when: () => !currentMenu,
    },
    {
      type: 'list',
      name: 'itemChoice',
      message: `\n
Money: ${inventory.Money}₽
Items:`,
      choices: [...itemChoices, '--BACK--\n'],
      when: ({ menuAction }) =>
        menuAction === 'Items' || currentMenu === 'Items',
    },
  ];

  return inquirer.prompt(menuOptions).then((answers) => {
    if (answers.itemChoice === '--BACK--\n') {
      currentMenu = null;
      return showMenu();
    } else if (answers.itemChoice) {
      const itemToUse = answers.itemChoice.split(':')[0];
      currentMenu = 'Items';
      return currentPlayerData.player
        .useItem(
          itemToUse,
          currentPlayerData.player,
          null,
          null,
          currentPlayerData
        )
        .then(() => showMenu());
    } else return answers.menuAction === 'Quit';
  });
}

module.exports = { showMenu };
