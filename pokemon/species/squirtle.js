const { Water } = require('../types/water')

class Squirtle extends Water {
    constructor(name = 'Squirtle', level, catchDifficulty, hitPoints, attack, defence) {
        super(name, level, 'water gun', catchDifficulty, hitPoints, attack, defence);
        this.art = `
        ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣤⣴⣶⣿⣿⣿⣶⣴⣄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
        ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣾⣿⣿⣿⣿⣿⣿⣻⣿⢿⣿⣿⣆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
        ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠰⣿⣿⣿⣿⣿⣿⡏⠘⠿⢠⣿⣿⣿⣗⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
        ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢰⣿⣿⣿⣿⣿⣿⠃⠀⢀⣸⣿⣿⣿⣿⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
        ⠀⠀⠀⠀⠀⠀⠀⠀⠠⠿⣿⣿⣿⣿⣿⣿⣿⣷⣯⣥⣷⡿⣿⣿⣿⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
        ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠙⣮⣵⣶⣷⣶⣾⣷⣶⣿⣿⣿⣶⣿⣿⡏⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
        ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠻⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠟⣳⣎⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
        ⠀⠀⠀⠀⠀⠀⠀⢀⣀⣴⣴⡾⣷⣮⣯⣽⣛⣛⣛⡛⣩⣧⣾⣯⡅⢦⢦⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
        ⠀⠀⠀⣀⣀⣤⣾⣿⣿⣿⢯⣿⣿⣿⣿⣿⣿⣿⡿⣾⣿⣿⣿⣿⣿⡄⢦⢁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
        ⠀⠀⠀⢈⣿⡺⣿⣿⣿⡯⣿⣿⣿⣿⣾⢯⣭⡭⣼⡿⢿⣿⣿⣿⣿⢣⢐⣾⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
        ⠀⠀⠀⠙⠛⠛⠛⠛⠛⢹⣿⣿⣿⣿⣿⣸⣿⣟⣯⣾⣹⡿⠿⡿⣣⣿⢸⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
        ⠀⠀⠀⠀⠀⠀⠀⠀⠀⢹⡞⣿⣿⣿⡟⣿⣷⣯⣝⡿⠿⢟⣯⣷⣿⡏⠸⡿⠇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
        ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠸⣽⣿⣿⣷⡆⣯⣭⣿⣿⣯⣿⣿⣿⡟⣿⣇⠏⠁⠀⠀ ⣠⣶⣿⣿⣿⣶⣄⠀⠀⠀
        ⠀⠀⠀⠀⠀⠀⠀⠀⣠⣷⡻⣿⣿⣿⡇⣿⣿⣿⣿⣿⢗⣽⣾⣿⣿⣽⠀⠀⠀⣰⣾⣿⣿⡿⠿⢿⣿⣿⡄⠀⠀
        ⠀⠀⠀⠀⠀⠀⠀⢰⣿⣿⣿⣝⠿⡿⣗⡻⢿⣿⣿⢏⣿⣿⣿⣿⣿⣿⣄⢠⣾⣿⣿⣿⢳⣾⣿⣷⣿⣿⡇⠀⠀
        ⠀⠀⠀⠀⠀⠀⠀⢸⣿⣿⣿⣿⣷⡽⠻⢿⣷⣾⣽⠸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡸⣿⣿⣿⣿⡿⠀⠀⠀
        ⠀⠀⠀⠀⠀⠀⠠⢼⣿⣿⣿⣿⣿⠀⠀⠀⠈⠉⠈⠁⢹⣿⣿⣿⣿⣿⡇⠘⠻⠿⣿⣿⣿⣮⣿⡿⠋⠀⠀⠀⠀
        ⠀⠀⠀⠀⠀⠀⠀⠉⠘⠛⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢿⣿⣿⣿⣿⣇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
        ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠉⠙⠟⠉⠋⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀`;
    }
}

module.exports = {
    Squirtle
}