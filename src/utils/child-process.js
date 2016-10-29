import { spawn } from 'child-process-promise';

export function splitCommandStr( commandStr ) {
  const [ command, ...args ] = commandStr.trim().split( /[\s]+/g );
  return [ command, args ];
}

export function exec( command, args, { cwd, env, shell = true } = {} ) {
  console.log( 'Executing:', command, ...args);
  return spawn( command, args.filter( Boolean ), {
    stdio: 'inherit',
    cwd,
    env: {...process.env, ...env, },
    shell,
  } );
}
