const ballsData = require('./balls-data');
const speciesData = require('./species-data');

function ball(str) {
  str = str.replace(' ', '');
  return new ballsData[str]();
}

function pokemon(str, ...args) {
  return new speciesData[str](...args);
}

module.exports = {
  ball,
  pokemon,
};
