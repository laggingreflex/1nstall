import yargs from 'yargs';
// import { dockerfiles } from './utils/fs';
// import { printUsage } from './utils/help';

const { argv: config } = yargs.options( {
  package: {
    alias: [ 'p' ],
    type: 'string'
  },
  installer: {
    alias: [ 'i' ],
    type: 'string'
  },
  save: {
    alias: [ 'S' ],
    type: 'boolean'
  },
  saveDev: {
    alias: [ 'D', 'dev' ],
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


// if (config.help) {
//   printUsage(true);
// }

// if ( config._.length > 2 ) {
//   throw new Error( 'Incorrect arguments' );
// }

if ( !config.package ) {
  config.package = config._[ config._.length - 1 ] || config._[ 0 ];
}
if ( !config.package ) {
  throw new Error( 'Need a package' );
}

if ( !config.installer ) {
  if ( config._.length > 1 ) {
    config.installer = config._[ 0 ];
  } else {
    config.installer = 'npm';
  }
}

if ( config.installer === 'y' ) {
  config.installer = 'yarn';
} else if ( config.installer === 'n' ) {
  config.installer = 'npm';
}

if ( config.installer !== 'npm' && 'yarn' !== config.installer ) {
  throw new Error( 'Installer needs to be either "npm" or "yarn"' );
}

if ( config._.slice( 0, 2 ).join( ' ' ) === 'yarn add' ) {
  config.save = true;
}

if ( config.save && config.saveDev ) {
  config.save = false;
  config.saveDev = true;
}

if ( !config.save && !config.saveDev ) {
  config.save = true;
}


export default config;
