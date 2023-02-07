const { Grass } = require('../types/grass')

class Bulbasaur extends Grass {
    constructor(name = 'Bulbasaur', level = 1, catchDifficulty = 5, hitPoints = level*7.5, attack = level*5, defence = level*5 ) {
        super(name, level = 1, 'vine whip', catchDifficulty = 5, hitPoints = level*7.5, attack = level*5, defence = level*5 );
        this.art = `
        ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⠀⠀⡀⠀⠀⠀⠀⠀
        ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡀⣀⣤⣾⢠⣾⢀⡀⠀⠀⠀⠀
        ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⣤⣶⣿⣿⣿⣿⠿⣿⣿⣿⣿⣽⣷⣿⡟⣾⠀⠀⠀⠀⠀
        ⠀⠀⠀⠀⠀⠀⠀⣄⢀⠀⠀⠀⠀⠀⠀⢠⣿⣿⣿⣿⣿⡟⠩⣾⣿⣿⣿⣿⣿⣿⣿⣿⡗⣿⠀⠀⠀⠀⠀
        ⠀⠀⠀⠀⠀⢠⣾⣿⣿⣽⣴⣶⣶⣶⣶⣾⣭⣿⣩⣯⣶⣿⣿⡜⣿⣿⣿⣿⣿⣿⣿⣿⣷⢹⣧⠀⠀⠀⠀
        ⠀⠀⠀⠀⠀⢸⣿⣿⣿⣿⢿⡿⠏⠁⢀⣴⣿⣿⣿⣿⣿⣿⣿⣿⣻⣿⣿⣿⣿⣿⣿⣿⣿⡄⢿⣧⠀⠀⠀
        ⠀⠀⠀⠀⣰⣿⣿⣿⡿⣷⣅⠀⣠⣶⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡸⢿⣿⣿⣿⣿⣿⣿⣿⣿⠸⣿⣧⠀⠀
        ⠀⠀⠀⣘⣿⢛⣿⣟⣠⣿⣿⡿⣿⣿⣿⣯⣿⢟⠏⠙⠻⣿⣿⣿⣇⣮⡹⢿⣿⣿⣿⣿⣿⣿⡇⣿⣿⡆⠀
        ⠀⠀⢰⣽⠓⣿⣿⣿⣿⣟⠋⠀⣿⣿⣯⣿⣿⣿⠼⣿⡆⢻⣿⣿⣿⣸⠟⠊⠙⢿⣿⣿⣿⠿⣿⣿⣿⡿⠀
        ⠀⠀⣸⢿⡠⢿⣿⣿⣿⣿⣿⣶⣿⣿⣿⡟⣿⣧⠀⢻⣃⣘⣿⣿⣿⣿⣷⠀⠀⠀⠈⠉⢭⣶⣿⣿⣿⠃⠀
        ⠀⠀⠛⡻⣷⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣧⣿⣿⣼⣯⣵⡾⣿⣿⣿⣿⣿⣷⡀⠀⠀⢀⣧⡙⣿⠿⠋⠀⠀
        ⠀⠀⠀⠉⠲⣭⡛⠛⠻⠿⠿⠿⠿⠿⠛⠛⠛⠟⢻⣩⣶⣾⣿⢋⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡌⠀⠀⠀⠀
        ⠀⠀⠀⠀⠀⠀⢹⣒⢭⣛⡻⠿⠿⠿⢟⣓⣢⣶⣿⡿⢟⣫⣼⣿⣿⣿⣿⣿⢹⢻⣾⠿⢻⣿⣿⡄⠀⠀⠀
        ⠀⠀⠀⠀⠀⠀⠸⣿⢿⡶⣾⣭⡽⣏⣭⣭⣭⣶⣷⣾⣪⣿⣿⣱⢿⣿⣿⣿⢰⡫⡞⠀⠘⣿⣿⣧⠀⠀⠀
        ⠀⠀⠀⠀⠀⠀⠈⢱⣿⡇⣿⣿⣷⣮⡝⠛⠿⢿⣿⣗⣽⡷⣸⣿⣿⣿⣿⠟⣾⣿⣄⣀⣀⣿⣿⡟⠀⠀⠀
        ⠀⠀⠀⠀⠀⠀⠀⠀⣯⣶⣿⣿⣿⡟⠁⠀⠀⠒⠶⡈⠉⢑⣿⣿⣿⣿⠋⠂⢻⣿⣿⣿⣿⣿⣿⠃⠀⠀⠀
        ⠀⠀⠀⠀⠀⠀⠀⠀⠺⠟⠻⡝⠋⠀⠀⠀⠀⠀⠀⣻⢾⢿⢿⢿⠟⠁⠀⠀⠀⠝⠫⠝⢟⠻⠁⠀⠀⠀⠀
        ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠁⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀`
    }
}

module.exports = {
    Bulbasaur
}