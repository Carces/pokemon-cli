const inquirer = require('inquirer');
const { movesData } = require('../main-game/data/moves-data');

class Pokemon {
  constructor(
    name,
    level = 1,
    types = ['normal'],
    moves = [],
    hitPoints = 10 + level * 4,
    attack = 10 + level * 2,
    defence = 10 + level * 2,
    spAttack = 10 + level * 2,
    spDefence = 10 + level * 2,
    speed = 10 + level * 2,
    accuracy = 100,
    catchDifficulty = 5,
    isEvolving
  ) {
    const movesWithUses = moves.map((moveName) => {
      const uses = movesData[moveName].uses;
      return {
        name: moveName,
        uses: { current: uses, max: uses },
      };
    });
    this.name = name;
    this.level = level;
    this.types = types;
    this.moves = movesWithUses;
    this.hitPoints = { current: hitPoints, max: hitPoints };
    this.attack = { current: attack, max: attack };
    this.defence = { current: defence, max: defence };
    this.spAttack = { current: spAttack, max: spAttack };
    this.spDefence = { current: spDefence, max: spDefence };
    this.speed = { current: speed, max: speed };
    this.accuracy = { current: accuracy, max: accuracy };
    this.isEvolving = isEvolving;

    this.catchDifficulty = catchDifficulty;
    this.xpThreshold = Math.floor(
      (this.level + 1) ** 2.3 * Math.pow(1.001, this.level)
    );
    this.xp = Math.floor(this.level ** 2.3 * Math.pow(1.001, this.level));
    this.activeEffects = {};
    this.id = crypto.randomUUID();
  }

  getResistance(move) {
    const strengths = {
      fighting: ['rock', 'bug', 'dark'],
      flying: ['fighting', 'bug', 'grass'],
      poison: ['fighting', 'poison', 'bug', 'grass', 'fairy'],
      ground: ['poison', 'rock'],
      rock: ['normal', 'flying', 'poison', 'fire'],
      bug: ['fighting', 'ground', 'grass'],
      ghost: ['poison', 'bug'],
      steel: [
        'steel',
        'normal',
        'flying',
        'rock',
        'bug',
        'grass',
        'psychic',
        'ice',
        'dragon',
        'fairy',
      ],
      fire: ['fire', 'bug', 'steel', 'ice', 'grass', 'fairy'],
      electric: ['electric', 'flying', 'steel'],
      psychic: ['psychic', 'fighting'],
      ice: ['ice'],
      dragon: ['grass', 'water', 'fire', 'electric'],
      dark: ['dark', 'ghost'],
      fairy: ['fighting', 'bug', 'dark'],
      grass: ['grass', 'water', 'ground', 'electric'],
      water: ['water', 'fire', 'steel', 'ice'],
    };
    let effectiveness = false;
    this.types.forEach((type) => {
      if (strengths[type]?.includes(move.type)) effectiveness--;
    });
    return effectiveness;
  }

  isImmuneTo(move) {
    const immunities = {
      normal: ['ghost'],
      flying: ['ground'],
      ground: ['electric'],
      ghost: ['normal', 'fighting'],
      steel: ['poison'],
      dark: ['psychic'],
      fairy: ['dragon'],
    };
    let isImmune = false;
    this.types.forEach((type) => {
      if (immunities[type]?.includes(move.type)) isImmune = true;
    });
    return isImmune;
  }

  getWeakness(move) {
    const weaknesses = {
      normal: ['fighting'],
      fighting: ['psychic', 'flying', 'fairy'],
      flying: ['rock', 'electric', 'ice'],
      grass: ['fire', 'flying', 'poison', 'bug', 'ice'],
      water: ['grass', 'electric'],
      fire: ['water', 'ground', 'rock'],
      poison: ['ground', 'psychic'],
      ground: ['water', 'grass', 'ice'],
      rock: ['fighting', 'ground', 'steel', 'water', 'grass'],
      bug: ['rock', 'flying', 'fire'],
      ghost: ['ghost', 'dark'],
      steel: ['fighting', 'ground', 'fire'],
      electric: ['ground'],
      psychic: ['bug', 'ghost', 'dark'],
      ice: ['fighting', 'rock', 'steel', 'fire'],
      dragon: ['dragon', 'ice', 'fairy'],
      dark: ['fighting', 'bug', 'fairy'],
      fairy: ['poison', 'steel'],
    };
    let effectiveness = 0;
    this.types.forEach((type) => {
      if (weaknesses[type]?.includes(move.type)) effectiveness++;
    });
    return effectiveness;
  }

  takeDamage(damage) {
    this.hitPoints.current = Math.max(
      0,
      +(this.hitPoints.current - damage).toFixed(2)
    );
  }

  useMove(move, target, outsideBattle) {
    const moveData = movesData[move.name];
    const moveIndex = this.moves.findIndex(
      (pokeMove) => pokeMove.name === move.name
    );
    this.moves[moveIndex].uses.current--;
    if (move.name !== 'confusionSelfAttack')
      console.log(`\n${this.name} used ${move.name}!`);

    if (moveData.doesDamage && !outsideBattle) {
      const random = Math.random() * 0.2 + 0.4;
      const power = 30 * moveData.damageMultiplier;
      const atkRatio = moveData.isSpAttack
        ? this.spAttack.current / target.spDefence.current
        : this.attack.current / target.defence.current;

      const baseDamage = (this.level / 4 + 2) * power * atkRatio;
      const finalDamage = +((baseDamage / 5) * random + 1).toFixed(2);
      return finalDamage;
    }
  }

  showXpBar() {
    const emptyBar = Array(20).fill('-');
    const xpRatio =
      (this.xp - Math.floor(this.level ** 2.3) * Math.pow(1.001, this.level)) /
      (this.xpThreshold -
        Math.floor(this.level ** 2.3) * Math.pow(1.001, this.level));
    const filledBar = emptyBar.map((dash, index) => {
      if (index === 19 && xpRatio < 1) return '-';
      else if (index < xpRatio * 20) return '■';
      else return '-';
    });
    const xpBar = `[${filledBar.join('')}]`;
    return `---------------------------------------
Level ${this.level} |${xpBar}| Level ${this.level + 1}
-----------------------------------------`;
  }

  addXp(num) {
    this.xp += num;
    let isLevelUp = false;

    if (this.xp >= this.xpThreshold) {
      this.level++;
      isLevelUp = true;
      this.hitPoints.max += 4;
      this.hitPoints.current += 4;
      this.attack.max += 2;
      this.attack.current += 2;
      this.defence.max += 2;
      this.defence.current += 2;
      this.xpThreshold = Math.floor(
        (this.level + 1) ** 2.3 * Math.pow(1.001, this.level)
      );
    }

    const xpPrompts = [
      {
        type: 'input',
        name: 'xpMessage',
        message: `${this.name} gained ${num} experience points!`,
      },
      {
        type: 'input',
        name: 'xpBar',
        message: () => this.showXpBar(),
      },
      {
        type: 'input',
        name: 'levelUp',
        message: `${this.name} grew to level ${this.level}!`,
        when: () => isLevelUp,
      },
    ];
    return inquirer.prompt(xpPrompts).then(() => {
      const newMoves = this.moveTable['level' + this.level];
      const returnPromise = !newMoves
        ? Promise.resolve()
        : this.addMoves(newMoves);
      return returnPromise.then(() => {
        if (this.evolvesTo && this.level >= this.evolvesTo.level)
          return this.evolve();
      });
    });
  }

  evolve(specialEvolutionType) {
    const create = require('../main-game/data/create');
    const newSpecies = specialEvolutionType
      ? this.evolvesTo.special[specialEvolutionType]
      : this.evolvesTo.species;
    const hpBelowMax = this.hitPoints.max - this.hitPoints.current;
    const attackBelowMax = this.attack.max - this.attack.current;
    const defenceBelowMax = this.defence.max - this.defence.current;
    const evolvedName =
      this.name === this.species ? this.evolvesTo.species : this.name;
    const evolvedForm = create.pokemon(
      newSpecies,
      evolvedName,
      this.level,
      this.moves,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      true
    );
    evolvedForm.hitPoints.current -= hpBelowMax;
    evolvedForm.attack.current -= attackBelowMax;
    evolvedForm.defence.current -= defenceBelowMax;

    const evolvePrompts = [
      {
        type: 'confirm',
        name: `confirmEvolving`,
        message: `${this.name} is trying to evolve into ${newSpecies}!\n\nLet it evolve?`,
      },
      {
        type: 'input',
        name: `evolveMessage`,
        message: () =>
          `${this.name} evolved into ${newSpecies}!\n${evolvedForm.art}`,
        when: ({ confirmEvolving }) => confirmEvolving,
      },
    ];
    return inquirer.prompt(evolvePrompts).then(({ confirmEvolving }) => {
      if (confirmEvolving) return evolvedForm;
    });
  }

  getMoveChoices(isOutsideBattle, namesOnly) {
    const namePadding = [...this.moves].sort(
      (a, b) => b.name.length - a.name.length
    )[0].name.length;
    return this.moves.map((move) =>
      namesOnly
        ? move.name
        : isOutsideBattle && movesData[move.name].effectOutsideBattle
        ? {
            name:
              move.name.padEnd(namePadding + 1) +
              `| PP: ${move.uses.current}/${move.uses.max}`,
            disabled: 'Cannot be used outside of battle.',
          }
        : move.name.padEnd(namePadding + 1) +
          `| PP: ${move.uses.current}/${move.uses.max}`
    );
  }

  addMoves(newMoves) {
    const movesQuestions = [];
    const moveNames = this.getMoveNames();
    const forgetChoices = [...moveNames, `--DON'T LEARN--`];
    let qCount = 0;

    newMoves.forEach((newMove) => {
      if (this.moves.length === 4) {
        qCount++;
        movesQuestions.push({
          type: 'list',
          name: newMove,
          message: `${this.name} is trying to learn ${newMove}, but it already has 4 moves. Forget a move to make room for ${newMove}?`,
          choices: (answers) => {
            if (answers[`moveToForget${qCount - 1}`] !== `--DON'T LEARN--`) {
              const forgetIndex = forgetChoices.indexOf(answers.moveToForget1);
              forgetChoices[forgetIndex] = newMove;
            }
            return forgetChoices;
          },
        });
      } else {
        const uses = movesData[newMove].uses;
        this.moves.push({
          name: newMove,
          uses: { current: uses, max: uses },
        });
        console.log(`${this.name} learned ${newMove}!`);
      }
    });
    return !movesQuestions[0]
      ? Promise.resolve()
      : inquirer.prompt(movesQuestions).then((answers) => {
          for (const move in answers) {
            if (move !== `--DON'T LEARN--`) {
              const indexToReplace = this.moveNames.indexOf(answers[move]);
              const uses = movesData[move].uses;
              this.moves[indexToReplace] = {
                name: move,
                uses: { current: uses, max: uses },
              };
            }
          }
        });
  }

  hasFainted() {
    return this.hitPoints.current === 0;
  }

  healToFull() {
    this.hitPoints.current = this.hitPoints.max;
    this.attack.current = this.attack.max;
    this.defence.current = this.defence.max;
    for (const effect in this.activeEffects) {
      if (!this.activeEffects[effect].permanent)
        delete this.activeEffects[effect];
    }
    this.moves.forEach((move, index) => {
      this.moves[index].uses.current = this.moves[index].uses.max;
    });
  }

  generateMoves() {
    if (this.level > 1 && !this.isEvolving) {
      // Give highest level moves possible
      const reversedMoveTable = Object.entries(this.moveTable).reverse();
      reversedMoveTable.forEach((movesEntry) => {
        const movesLevel = movesEntry[0].replace('level', '');
        if (this.level >= movesLevel && this.moves.length < 4) {
          movesEntry[1].forEach((move) => {
            const uses = movesData[move].uses;
            if (this.moves.length < 4)
              this.moves.push({
                name: move,
                uses: { current: uses, max: uses },
              });
          });
        }
      });
    }
  }
}

module.exports = {
  Pokemon,
};
