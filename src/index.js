import 'source-map-support/register';
import arrify from 'arrify';
import config from './config';
import { install } from './utils/installer';
import { move } from './utils/fs';

async function main() {
  await Promise.all(arrify(config.package).map(async (pkgName) => {
    console.log({ pkgName });
    const tmpdir = await install({ ...config, package: pkgName });
    await move({ ...config, tmpdir, package: pkgName });
  }));
}

main().catch((err) => {
  console.error(err.message);
});
