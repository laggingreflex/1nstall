import path from 'path';
import { exec } from './child-process';
import {
  cwd,
  tmpdir,
  mktmpdir,
  getPackageJson,
  outputPackageJson,
} from './fs';

const tmpdir1 = tmpdir;
export async function install( { package: packageLiteral, installer, tmpdir = tmpdir1, saveDev = false } = {} ) {
  const [ packageName, packageVersion ] = packageLiteral.split( /@/ );
  await outputPackageJson( tmpdir );
  console.log( `Installing ${packageLiteral}...` );
  let command, args;
  if ( installer === 'npm' ) {
    command = 'npm';
    args = [ 'install' ];
    if ( saveDev ) {
      args.push( '--saveDev' );
    } else {
      args.push( '--save' );
    }
    args.push( packageLiteral );
  } else {
    command = 'yarn';
    args = [ 'add' ];
    if ( saveDev ) {
      args.push( '--dev' );
    }
    args.push( packageLiteral );
  }
  await exec( command, args, { cwd: tmpdir } );
}


// export function build( {} = {} ) {
//   const args = [ 'build' ];
//   args.push( '--rm' );
//   args.push( '-t', cwdBase );
//   args.push( '.' );
//   console.log( 'Executing:', 'docker', ...args );
//   return exec( 'docker', args );
// }
// export function run( { command, noMountCwd = false, mountHome = false, volume } = {} ) {
//   const args = [ 'run', '-it', '--rm' ];
//   if ( !noMountCwd ) {
//     args.push( '--volume', `${cwdFull}${path.sep}:/${cwdBase}` );
//   }
//   if ( mountHome ) {
//     args.push( '--volume', `${homedir}${path.sep}:/root` );
//   }
//   if ( volume ) {
//     if ( !Array.isArray( volume ) ) {
//       volume = [ volume ];
//     }
//     volume.forEach( volume => {
//       const paths = volume.split( /:/g );
//       if ( paths.length <= 1 ) {
//         volume = fixVolumePath( volume, cwdBase );
//         args.push( '--volume', `${volume}` );
//       } else {
//         volume = paths.pop();
//         volume = fixVolumePath( volume, cwdBase );
//         let mount = paths.join( '' );
//         mount = fixMountPath( mount, homedir, cwdFull );
//         args.push( '--volume', `${mount}${path.sep}:/${volume}` );
//       }
//     } );
//   }
//   args.push( cwdBase );
//   if ( command && command.length ) {
//     args.push( ...command );
//   }
//   console.log( 'Executing:', 'docker', ...args );
//   return exec( 'docker', args );
// }

// export function fixVolumePath( p, base ) {
//   const o = p;
//   p = p.replace( /[\\]+/g, '/' );
//   if ( p.charAt( 0 ) !== '/' ) {
//     p = `${base}/${p}`;
//     console.warn( `WARNING: You've specified a non-absolute container-dir volume path: ${o}` );
//     console.warn( 'Docker requires container-dir to be an absolute path - https://docs.docker.com/engine/tutorials/dockervolumes/#mount-a-host-directory-as-a-data-volume' );
//     console.warn( `Using: ${p}` );
//   }
//   return p;
// }

// export function fixMountPath( p, homedir, base ) {
//   const o = p;
//   if ( p.charAt( 0 ) === '~' ) {
//     p = path.join( homedir, p.substr( 1 ) );
//   } else if ( !path.isAbsolute( p ) ) {
//     p = path.join( base, p );
//     if ( p.match( /[\/\\]/ ) ) {
//       console.warn( `WARNING: You've specified a non-absolute host-dir mount path: ${o}` );
//       console.warn( 'Docker requires host-dir to be an absolute path - https://docs.docker.com/engine/tutorials/dockervolumes/#mount-a-host-directory-as-a-data-volume' );
//       console.warn( `Using: ${p}` );
//     } else {
//       console.warn( `WARNING: You've specified a host-dir mount that could either be a naned volume: ${o}` );
//       console.warn( 'Please use --named-volume option to use a volume by name' );
//       console.warn( `Using: ${p}` );
//     }
//   }
//   return p;
// }
