#!/usr/bin/env node

const arrify = require('arrify');
const config = require('./config');
const { install } = require('./utils/installer');
const { move } = require('./utils/fs');

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
