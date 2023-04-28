/*
MESSAGE SYNTAX: 

{
    npc: 0,
    text: `Hi, I'm ${this.npcs[0]}.`
    delay: 1000
}
*/

// IGNORE BELOW - make messages objects with a delay prop instead
// Add specific pause length after message with {<number in ms> at the end of the message} e.g.
// '2:Wait a moment, please!...{1500}'

// Add pause before message by placing pause in ms at the start instead e.g
// '{1000}1:Hm? Sorry I dozed off for a second!'

const inquirer = require('inquirer');

class Conversation {
  constructor(npcs, messages, defaultTimeout = 500) {
    this.npcs = npcs;
    this.messages = messages;
    this.defaultTimeout = defaultTimeout;
    this.prompts = messages.map((message, i) => {
      return {
        type: 'input',
        name: 'i',
        message: `${npcs[message.npc]}:  ${message.text}`,
      };
    });
  }
  delayedPrompt(prompt, delay) {
    return new Promise((resolve) => {
      setTimeout(() => {
        inquirer.prompt(prompt).then((answers) => {
          resolve(answers);
        });
      }, delay);
    });
  }
  start() {
    const conversation = this;
    console.log(conversation.prompts, '<<<<<, NPCS');
    function prompt(index) {
      const promptDelay =
        index === 0
          ? 0
          : conversation.messages[index].delay || conversation.defaultTimeout;

      return conversation
        .delayedPrompt(conversation.prompts[index], promptDelay)
        .then(() =>
          conversation.prompts[index + 1]
            ? prompt(index + 1)
            : Promise.resolve()
        );
    }

    return prompt(0);
  }
}

module.exports = { Conversation };
