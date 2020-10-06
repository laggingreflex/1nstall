import yargs from 'yargs';

const { argv: config } = yargs(process.argv.slice(2)).options({
  cwd: {
    default: process.cwd()
  },
  package: {
    type: 'array',
  },
  yarn: {
    alias: ['y'],
    type: 'boolean'
  },
  saveDev: {
    alias: ['D'],
    type: 'boolean'
  },
  debug: {
    alias: ['d'],
    type: 'boolean'
  },
}).scriptName('one').wrap(0);

if (!config.package) config.package = config._;

export default config;
