const { Pokemon } = require('../../pokemon/pokemon')

class Rattata extends Pokemon {
    constructor(name = 'Rattata', level, catchDifficulty, hitPoints, attack, defence) {
        super(name, level, 'tackle', catchDifficulty, hitPoints, attack, defence);
        this.art = `
        ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⣴⣦⣤⣄⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
        ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⣿⡯⣭⣟⢿⣷⣄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
        ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠙⢿⣿⣿⣿⡏⠻⢿⣷⣄⠀⠀⠀⠀⠀⠀⠀⠀
        ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠉⠉⠁⠀⠀⠉⢿⣦⠀⠀⠀⠀⠀⠀⠀
        ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣞⢷⣦⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢻⡆⠀⠀⠀⠀⠀⠀
        ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡜⣾⡟⣿⣿⠀⠀⠀⠀⠀⠀⠀⠀⣀⣠⣤⣤⡄⠀⠀⠀⠀⠀⠀⠀⠀⢿⡀⠀⠀⠀⠀⠀
        ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡗⣿⣵⣶⣿⣿⣿⣷⣶⣤⡀⣤⣾⢟⣻⣭⡽⣷⠀⠀⠀⠀⠀⠀⠀⠀⠈⡇⠀⠀⠀⠀⠀
        ⠀⠀⠀⠀⠀⠀⠈⠒⢄⡀⢠⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣾⣟⣵⣿⣿⣿⡇⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⡇⠀⠀⠀⠀⠀
        ⠀⠀⠀⠀⠀⠀⠀⢀⣤⣷⣿⣿⣿⣿⣿⣿⡿⠟⣯⣯⣿⣿⣿⣼⣿⣿⣿⣧⡟⢀⣠⣤⣶⣦⣤⣀⠀⢀⡇⠀⠀⠀⠀⠀
        ⠀⠀⠀⠀⠀⠀⠀⢸⣿⣿⣿⣿⣿⣿⣟⣁⣧⢦⣿⢯⣿⣿⠿⣿⣟⣻⣟⡾⣳⣶⣿⣿⣿⣿⣿⣿⣷⡼⠃⠀⠀⠀⠀⠀
        ⠀⠀⠀⠀⠀⠀⠀⠀⣝⣻⣿⣿⢟⢿⣿⣿⣿⣿⣿⣯⢽⣿⣿⣖⣒⣒⣶⣶⣿⣿⣿⣿⣽⣿⣿⣿⣿⣿⠀⠀⠀⠀⠀⠀
        ⠀⠀⠀⠀⢀⣠⣤⣶⣿⢿⣿⢯⢿⣷⣝⢿⣿⣿⣿⣿⣿⣿⣿⡿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡇⠀⠀⠀⠀⠀
        ⠀⠀⠈⣩⣿⣽⣿⣿⣽⣹⣯⣿⣷⡹⢯⣶⣝⢿⣿⣿⣿⣿⣟⣽⣿⣿⣿⣿⢿⣿⣿⣿⣿⡿⣿⣿⣿⣿⣷⡀⠀⠀⠀⠀
        ⠀⠀⠈⠉⠈⠉⠀⠀⠀⠀⠀⠀⠀⠈⣿⣿⣿⢹⣿⡿⠿⢿⣾⣿⣿⣿⣿⢯⣿⣿⣿⣿⣿⣿⡻⣿⣿⣿⣿⣿⣤⣀⠀⠀
        ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠰⢿⣿⣿⠟⠋⠀⢠⣿⣿⣿⣿⣿⡃⣽⣛⣛⠛⠛⠋⠁⠀⠉⠻⠿⣿⣿⠿⣿⠀⠀
        ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⣿⣿⣿⣿⡿⠱⠛⠕⠛⠁⠀⠀⠀⠀⠀⠀⠀⢀⣴⣿⣿⡿⠀⠀
        ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⢴⣾⣿⣿⡿⠋⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⡟⢫⠟⠁⠀⠀
        ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠠⠟⠩⠟⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀`;
    }
}

module.exports = {
    Rattata
}