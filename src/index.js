import 'source-map-support/register';
import config from './config';
import { install } from './utils/installer';
import { move } from './utils/fs';

async function main() {
  await install( config );
  await move( config );
}

main().catch( ( err ) => {
  console.error( err.message );
} );
