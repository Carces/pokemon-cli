const inquirer = require('inquirer');

class Conversation {
  constructor(npcs, messages, defaultTimeout = 100) {
    this.npcs = npcs;
    this.messages = messages;
    this.defaultTimeout = defaultTimeout;
    this.prompts = messages.map((message, i) => {
      return {
        type: 'input',
        name: i.toString(),
        message:
          message.npc || message.npc === 0
            ? `${npcs[message.npc]}:  ${message.text}`
            : `\n${message.text}\n`,
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
    console.log('\n');
    const conversation = this;
    function prompt(index) {
      const promptDelay =
        index === 0
          ? 0
          : conversation.messages[index].delay || conversation.defaultTimeout;

      return conversation
        .delayedPrompt(conversation.prompts[index], promptDelay)
        .then(() => {
          if (conversation.prompts[index + 1]) {
            return prompt(index + 1);
          } else {
            console.log('\n');
            return Promise.resolve();
          }
        });
    }

    return prompt(0);
  }
}

module.exports = { Conversation };
