# Pokemon CLI

Pokemon fangame played in the CLI using Inquirer.js for player choices.

## Table of Contents

1.  [Documentation](#documentation)
    1.  [Installation](#installation)
    2.  [Features](#features)
    3.  [Limitations](#limitations)
2.  [Credits](#credits)
3.  [License](#license)

# Documentation

## Installation

---

### Dependencies:

Requires Node.js and Inquirer.js to function.
Other dependencies are included with Node.js (fs and path)

Tested with Node.js v19.3.0 and Inquirer.js v8.0.0. 

Earlier versions may work but are not officially supported.
Later versions of Inquirer.js are likely to cause conflicts. Please install Inquirer.js v8.0.0 specifically.

- [Inquirer](https://github.com/SBoudrias/Inquirer.js) v8.0.0

### Setup

---

#### 1. Install Node.js

        https://nodejs.org/en/download

#### 2. Install all required dependencies:

        npm install

#### 3. Clone repository:

Fork and/or clone the repository to your local machine.

The game writes save data to a file in its folder, so ensure that you clone it into a folder where you have permission to write files.

#### 4. Start game:

Using your choice of CLI, navigate to the root folder of the cloned repository (/fun-pokemon-battler).

Run the game using Node.js:

        node game.js
        
Use your keyboard to interact with the game when prompted, using arrow keys to highlight an option and the enter key to select your choice.

# Credits

Pokémon © 2002-2023 Pokémon. © 1995-2023 Nintendo/Creatures Inc./GAME FREAK inc. TM, ®. Pokémon and other game content are trademarks of Nintendo.

No copyright or trademark infringement is intended in using Pokémon content in this free fangame.


---

This fangame started life as a 2-day pair-programming task for the Northcoders software development bootcamp.

The original task was based on learning object-oriented-programming, and mostly consisted of creating classes and methods.
Initial ideas for the structure of classes were provided by Northcoders, as well as the suggestion to use Inquirer.js.

The majority of the game was then expanded from this initial task as a solo project over the following month.
This extension was not part of the Northcoders bootcamp, and was done solely as a learning exercise.

Pokemon CLI is distributed as a free and open-source project.
Anyone using or distributing the game acknowledges the copyright attributions above and takes responsibility for their use of copyrighted materials.

# License

Copyright (c) 2023 Theo Johnson (GitHub: Carces)

Licensed under the MIT license.
