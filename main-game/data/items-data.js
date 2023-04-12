const itemsData = {
  Money: {
    name: 'Money',
    type: 'money',
    price: 1,
    rarity: 0,
    description: 'Money can be exchanged for goods and services.',
    useInBattle: false,
    useInMenu: false,
  },
  'Poke Ball': {
    name: 'Poke Ball',
    type: 'ball',
    price: 200,
    rarity: 0,
    description:
      'A basic Poke Ball. Has an average chance of catching Pokemon.',
    useInBattle: true,
    useInMenu: false,
  },
  'Great Ball': {
    name: 'Great Ball',
    type: 'ball',
    price: 600,
    rarity: 1,
    description:
      'A high-quality Poke Ball. Has an above average chance of catching Pokemon.',
    useInBattle: true,
    useInMenu: false,
  },
  'Ultra Ball': {
    name: 'Ultra Ball',
    type: 'ball',
    price: 1200,
    rarity: 3,
    description:
      'The best Poke Ball money can buy. Has a high chance of catching Pokemon.',
    useInBattle: true,
    useInMenu: false,
  },
  'Master Ball': {
    name: 'Master Ball',
    type: 'ball',
    price: null,
    rarity: 10,
    description:
      'A legendary Poke Ball capable of capturing any Pokemon, even when the Pokemon has not been weakened.',
    useInBattle: true,
    useInMenu: false,
  },
  Potion: {
    name: 'Potion',
    type: 'heal',
    price: 300,
    rarity: 0,
    description: 'A basic potion. Restores up to 10hp',
    useInBattle: true,
    useInMenu: true,
    effect: {
      stat: 'hitPoints',
      modifier: 10,
      staysAfterBattle: true,
    },
  },
  Antidote: {
    name: 'Antidote',
    type: 'remove',
    price: 100,
    rarity: 0,
    description: 'Cures poisoned Pokemon.',
    useInBattle: true,
    useInMenu: true,
    effect: {
      remove: 'poisoned',
    },
  },
  Protein: {
    name: 'Protein',
    type: 'boost',
    price: 9800,
    rarity: 5,
    description: `Vitamins: These are good for your strength. Permanently boost a Pokemon's attack by 2.`,
    useInBattle: false,
    useInMenu: true,
    effect: {
      stat: 'attack',
      modifier: 10,
      staysAfterBattle: true,
      permanent: true,
    },
  },
  Shorts: {
    name: 'Shorts',
    type: 'misc',
    price: 200,
    rarity: 100,
    description: `Apparently they're comfy and easy to wear.`,
    useInBattle: false,
    useInMenu: true,
    effect: {
      message: `You put the shorts on\n...\nHey, they are pretty comfy!`,
    },
  },
  Sunglasses: {
    name: 'Sunglasses',
    type: 'misc',
    price: 500,
    rarity: 100,
    description: `They're Squirtle-sized. Will they fit?`,
    useInBattle: false,
    useInMenu: true,
    effect: {
      message: `You've never looked cooler.`,
    },
  },
};

module.exports = { itemsData };
