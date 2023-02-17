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
    catchDifficulty = 5
  ) {
    this.name = name;
    this.level = level;
    this.type = type;
    this.moves = moves;
    this.hitPoints = { current: hitPoints, max: hitPoints };
    this.attack = { current: attack, max: attack };
    this.defence = { current: defence, max: defence };
    this.catchDifficulty = catchDifficulty;
    this.xpThreshold = Math.floor((this.level + 1) ** 2.5);
    this.xp = Math.floor(this.level ** 2.5);
    this.activeEffects = {};
  }

  isResistantTo(move) {
    const strengths = {
      fire: 'grass',
      grass: 'water',
      water: 'fire',
    };
    return strengths[this.type] === move.type;
  }

  isWeakTo(move) {
    const weaknesses = {
      grass: 'fire',
      water: 'grass',
      fire: 'water',
    };
    return weaknesses[this.type] === move.type;
  }

  takeDamage(damage) {
    this.hitPoints.current = Math.max(
      0,
      +(this.hitPoints.current - damage).toFixed(2)
    );
  }

  useMove(move, target) {
    console.log(`\n${this.name} used ${move.name}!`);

    if (move.doesDamage) {
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
    const xpRatio = this.xp / this.xpThreshold;
    const filledBar = emptyBar.map((dash, index) => {
      if (index < xpRatio * 20) return '■';
      else return '-';
    });
    const xpBar = `[${filledBar.join('')}]`;
    console.log('---------------------------------------');
    console.log(`Level ${this.level} |${xpBar}| Level ${this.level + 1}`);
    console.log('---------------------------------------');
  }

  addXp(num) {
    this.xp += num;
    console.log(`${this.name} gained ${num} experience points!`);
    this.showXpBar();

    if (this.xp >= this.xpThreshold) {
      this.level++;
      this.hitPoints.max += 1.25;
      this.hitPoints.current += 1.25;
      this.attack.max += 0.75;
      this.attack.current += 0.75;
      this.defence.max += 0.75;
      this.defence.current += 0.75;
      this.xpThreshold = Math.floor((this.level + 1) ** 2.5);
      console.log(`\n${this.name} grew to level ${this.level}!\n`);

      const newMoves = this.moveTable['level' + this.level];
      if (newMoves) return this.addMoves(newMoves);
    }
    return Promise.resolve();
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
}

module.exports = {
  Pokemon,
};
