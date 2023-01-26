class Pokeball {
    constructor() {
        this.storage = null;
    }

    throw(pokemon) {
        if(pokemon && ! this.storage) {
            console.log(`You caught ${pokemon.name}!`)
            this.storage = pokemon;
        }
        else if(pokemon && this.storage) {
            console.log('There is already a pokemon in this ball!')
        }
        else if(this.storage) {
            console.log(`Go, ${this.storage.name}!`)
            return this.storage;
        }
        else console.log('Your ball is empty and you are a numpty.')
    }

    isEmpty() {
        return ! this.storage;
    }

    contains() {
        return (this.storage) ? this.storage.name : "empty ...";
    }
}

module.exports = { Pokeball, }