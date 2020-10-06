import Path from 'path';
import mainConfig from './config.js';
import fs from 'fs-extra';
import { arrify, install, move, Error } from './utils.js';

export default async function main(config = mainConfig) {
  if (typeof config === 'string' || Array.isArray(config)) config = { package: config };
  const packages = arrify(config.package);
  if (!packages.length) throw new Error('Need a package to install');
  console.log(`Installing ${packages.length} package(s):`, packages.join(', ') + '...');
  const installed = await Promise.all(packages.map(async pkgName => {
    const dest = Path.join(config.cwd, 'node_modules', pkgName);
    if (await fs.pathExists(dest)) {
      if (!config.force) {
        console.log('Package already exists:', dest);
        console.log('Use --force to remove');
        return {};
      }
    }

    const tmpdir = await install({ ...config, package: pkgName });
    return { pkgName, tmpdir };
  }));
  console.log(`Installed ${packages.length} package(s):`, packages.join(', '));
  console.log(`Moving ${packages.length} package(s)...`);
  for (const { pkgName, tmpdir } of installed) {
    if (!pkgName) continue;
    await move({ ...config, tmpdir, package: pkgName });
  }
  console.log(`Moved ${packages.length} package(s)`);
}
