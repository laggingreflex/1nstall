const { spawn } = require('child-process-promise');

const splitCommandStr = exports.splitCommandStr = (commandStr) => {
  const [command, ...args] = commandStr.trim().split(/[\s]+/g);
  return [command, args];
};

const exec = exports.exec = (command, args, { cwd, env, shell = true } = {}) => {
  console.log('Executing:', command, ...args);
  return spawn(command, args.filter(Boolean), {
    stdio: 'inherit',
    cwd,
    env: { ...process.env, ...env, },
    shell,
  });
};
