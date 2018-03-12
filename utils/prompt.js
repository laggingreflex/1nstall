const { prompt } = require('inquirer');

const confirm = exports.confirm = async (message, def) => {
  return (await prompt([{
    type: 'confirm',
    name: 'confirm',
    message,
    default: def || false
  }])).confirm;
};
