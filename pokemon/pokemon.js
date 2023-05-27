const inquirer = require('inquirer');

class Pokemon {
  constructor(
    name,
    level = 1,
    type = 'normal',
    moves = [tackle],
    hitPoints = 10 + level * 2,
    attack = 10 + level * 2,
    defence = 10 + level * 2,
    speed = 10 + level * 2,
    accuracy = 100,
    catchDifficulty = 5,
    isEvolving
  ) {
    this.name = name;
    this.level = level;
    this.type = type;
    this.moves = moves;
    this.hitPoints = { current: hitPoints, max: hitPoints };
    this.attack = { current: attack, max: attack };
    this.defence = { current: defence, max: defence };
    this.speed = { current: speed, max: speed };
    this.accuracy = { current: accuracy, max: accuracy };

    this.catchDifficulty = catchDifficulty;
    this.xpThreshold = Math.floor(
      (this.level + 1) ** 2.3 * Math.pow(1.001, this.level)
    );
    this.xp = Math.floor(this.level ** 2.3 * Math.pow(1.001, this.level));
    this.activeEffects = {};
    this.id = crypto.randomUUID();
    if (this.level > 1 && !isEvolving) {
      // Give highest level moves possible
      const reversedMoveTable = Object.entries(
        this.constructor.moveTable
      ).reverse();
      reversedMoveTable.forEach((movesEntry) => {
        const movesLevel = movesEntry[0].replace('level', '');
        if (this.level >= movesLevel && this.moves.length < 4) {
          movesEntry[1].forEach((move) => {
            if (this.moves.length < 4) this.moves.push(move);
          });
        }
      });
    }
  }

  isResistantTo(move) {
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
    return strengths[this.type]?.includes(move.type);
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
    return immunities[this.type]?.includes(move.type);
  }

  isWeakTo(move) {
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
    return weaknesses[this.type]?.includes(move.type);
  }

  takeDamage(damage) {
    this.hitPoints.current = Math.max(
      0,
      +(this.hitPoints.current - damage).toFixed(2)
    );
  }

  useMove(move, target, outsideBattle) {
    console.log(`\n${this.name} used ${move.name}!`);

    if (move.doesDamage && !outsideBattle) {
      const random = Math.random() * -0.5 + 2.75;
      const damage =
        (random + this.level * 0.5) *
        (this.attack.current / target.defence.current) *
        move.damageMultiplier;
      const damageToReturn = Math.max(1, +damage.toFixed(2));
      return damageToReturn;
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
    return `-----------------------------------------
Level ${this.level} |${xpBar}| Level ${this.level + 1}
-----------------------------------------`;
  }

  addXp(num) {
    this.xp += num;
    console.log(`\n${this.name} gained ${num} experience points!\n`);

    if (this.xp >= this.xpThreshold) {
      this.level++;
      this.hitPoints.max += 1.25;
      this.hitPoints.current += 1.25;
      this.attack.max += 0.75;
      this.attack.current += 0.75;
      this.defence.max += 0.75;
      this.defence.current += 0.75;
      this.xpThreshold = Math.floor(
        (this.level + 1) ** 2.3 * Math.pow(1.001, this.level)
      );
      console.log(`\n${this.name} grew to level ${this.level}!\n`);

      const newMoves = this.moveTable['level' + this.level];
      if (newMoves) return this.addMoves(newMoves);
      if (this.evolvesTo.level >= this.level) return this.evolvesTo.species;
    }
  }

  evolve(specialEvolutionType) {
    const create = require('../main-game/data/create');
    let newSpecies;
    if (specialEvolutionType) {
      newSpecies = this.evolvesTo.special[specialEvolutionType];
    }
    const hpBelowMax = this.hitPoints.max - this.hitPoints.current;
    const attackBelowMax = this.attack.max - this.attack.current;
    const defenceBelowMax = this.defence.max - this.defence.current;
    const evolvedName =
      this.name === this.species ? this.evolvesTo.species : this.name;
    const evolvedForm = create.pokemon(
      this.evolvesTo.species,
      this.name,
      this.level,
      this.moves
    );
    evolvedForm.hitPoints.current -= hpBelowMax;
    evolvedForm.attack.current -= attackBelowMax;
    evolvedForm.defence.current -= defenceBelowMax;
    return evolvedForm;
  }

  addMoves(moves) {
    const movesQuestions = [];
    const forgetChoices = [...this.moves, `--DON'T LEARN--`];
    let qCount = 0;

    moves.forEach((move) => {
      if (this.moves.length === 4) {
        qCount++;
        movesQuestions.push({
          type: 'list',
          name: move,
          message: `${this.name} is trying to learn ${move}, but it already has 4 moves. Forget a move to make room for ${move}?`,
          choices: (answers) => {
            if (answers[`moveToForget${qCount - 1}`] !== `--DON'T LEARN--`) {
              const forgetIndex = forgetChoices.indexOf(answers.moveToForget1);
              forgetChoices[forgetIndex] = move;
            }
            return forgetChoices;
          },
        });
      } else {
        this.moves.push(move);
        console.log(`${this.name} learned ${move}!`);
      }
    });
    return !movesQuestions[0]
      ? Promise.resolve()
      : inquirer.prompt(movesQuestions).then((answers) => {
          for (const move in answers) {
            if (move !== `--DON'T LEARN--`) {
              const indexToReplace = this.moves.indexOf(answers[move]);
              this.moves[indexToReplace] = move;
            }
          }
          return answers;
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
  }
}

module.exports = {
  Pokemon,
};
