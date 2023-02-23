const delay = (timeInMs, valueToPassDown) => {
  return new Promise((resolve) =>
    setTimeout(resolve, timeInMs, valueToPassDown)
  );
};

const delayInit = () => {
  Promise.prototype.delay = function (timeInMs) {
    return this.then((valueToPassDown) => delay(timeInMs, valueToPassDown));
  };
};

const createDelay = (timeInMs) => Promise.resolve().delay(timeInMs);

module.exports = { delay, delayInit, createDelay };
