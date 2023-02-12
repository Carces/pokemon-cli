const inquirer = require('inquirer');
const fs = require('fs/promises');
const path = require('path')
const { Trainer } = require('./trainers/trainer.js');
const { Player } = require('./trainers/player.js');
const speciesData = require('./data/species-data.js');

function newPokemon(speciesName) {
    return new speciesData[speciesName]
}

module.exports = fs.readFile(path.join(__dirname, 'data', 'save-data.json'), 'utf-8')
.then((saveFile) => {
    const saveData = JSON.parse(saveFile)
    const playerData = saveData.playerData
    const rivalData = saveData.rivalData
    const player = playerData.player
    const rival = rivalData.rival

    player.belt.forEach((ball, i) => {

        // FOR EACH POKEMON - create a new one with 
        // player.belt[i].storage = newPokemon
        // console.log(player.belt[i].storage)
    })
    // const player = new Player()
    // const rival = rivalData.rival

    // console.log(player.currentPokeball)
    // console.log(Object.getOwnPropertyNames(player.currentPokeball))
    // console.log(player.currentPokeball.throw())
    // const testSaveBattle = new Battle(player, rival)
    // testSaveBattle.startBattle()
    return [playerData, rivalData]
})
