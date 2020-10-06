import mainConfig from './config.js'
import { arrify, install, move, Error } from './utils.js'

export default async function main(config = mainConfig) {
  if (typeof config === 'string' || Array.isArray(config)) config = { package: config };
  const packages = arrify(config.package);
  if (!packages.length) throw new Error('Need a package to install');
  console.log(`Installing ${packages.length} package(s):`, packages.join(', ') + '...');
  const installed = await Promise.all(packages.map(async pkgName => {
    const tmpdir = await install({ ...config, package: pkgName });
    return { pkgName, tmpdir };
  }));
  console.log(`Installed ${packages.length} package(s):`, packages.join(', '));
  console.log(`Moving ${packages.length} package(s)...`);
  for (const { pkgName, tmpdir } of installed) {
    await move({ ...config, tmpdir, package: pkgName });
  }
  console.log(`Moved ${packages.length} package(s)`);
}
