import yargs from 'yargs';

const { argv: config } = yargs.options( {
  cwd: {
    default: process.cwd()
  },
  yarn: {
    alias: [ 'y' ],
    type: 'boolean'
  },
  saveDev: {
    alias: [ 'd' ],
    type: 'boolean'
  },
  debug: {
    alias: [ 'd' ],
    type: 'boolean'
  },
  help: {
    alias: [ 'h', '?' ],
    type: 'boolean'
  }
} );

config.package = config._;

if ( !config.package.length ) {
  throw new Error( 'Need a package' );
}

export default config;
