const itemsData = {
    'Money': {
        name: 'Money',
        type: 'money',
        price: 1,
        useInBattle: false,
        useInMenu: false
    },
    'Poke Ball': { 
        name: 'Poke Ball',
        type: 'ball',
        price: 200,
        useInBattle: true,
        useInMenu: false,
    },
    'Great Ball': { 
        name: 'Great Ball',
        type: 'ball',
        price: 600,
        useInBattle: true,
        useInMenu: false,
    },
    'Ultra Ball': { 
        name: 'Ultra Ball',
        type: 'ball',
        price: 1200,
        useInBattle: true,
        useInMenu: false,
    },
    'Master Ball': { 
        name: 'Master Ball',
        type: 'ball',
        price: null,
        useInBattle: true,
        useInMenu: false,
    },
    'Potion': { 
        name: 'Potion',
        type: 'heal',
        price: 300,
        useInBattle: true,
        useInMenu: true,
        effect: { 
            stat: 'hitPoints', 
            modifier: 10, 
            staysAfterBattle: true 
        },
    },
    'Protein': { 
        name: 'Protein',
        type: 'boost',
        price: 9800,
        useInBattle: false,
        useInMenu: true,
        effect: { 
            stat: 'attack', 
            modifier: 10, 
            staysAfterBattle: true,
            permanent: true
        },
    },
}

module.exports = { itemsData }