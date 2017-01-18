import os from 'os';
import path from 'path';
import fs from 'fs-promise';
import sortObject from 'sort-object';
import _ from 'lodash';

export const generateID = () => 'xxxxxxxx'
  .replace(/x/g, x => Math.random()
    .toString(36)
    .replace(/[^a-z]+/g, '')
    .substr(0, 1));

export const generateTempDir = () => path.join(os.tmpdir(), '1nstall', generateID());

export function getPackageJson(dir) {
  const file = path.join(dir, 'package.json');
  console.log(`Reading ${file}...`);
  return fs.readJson(file);
}
export async function outputPackageJson(dir, data) {
  const file = path.join(dir, 'package.json');
  const fileBkp = path.join(dir, `package.bkp.${Date.now() + 0}.json`);
  try {
    await fs.copy(file, fileBkp);
  } catch (err) {}
  console.log(`Creating ${file}...`);
  return fs.outputJson(file, data);
}

export async function move({ package: packageLiteral, cwd, tmpdir, debug = false }) {
  const [packageName] = packageLiteral.split(/@/);

  const movePackage = {
    from: path.join(tmpdir, 'node_modules', packageName),
    to: path.join(cwd, 'node_modules', packageName),
  };
  console.log(`Moving package... \n  ${movePackage.from} -> \n  ${movePackage.to}`);
  // await fs.remove( movePackage.to );
  try {
    await fs.mkdirp(path.join(movePackage.to, '..'));
  } catch (error) {
    console.error('  ' + error.message);
  }
  try {
    await fs.rename(movePackage.from, movePackage.to);
  } catch (error) {
    console.error('  ' + error.message);
    console.log('  Couldn\'t rename, actualy moving...');
    await fs.move(movePackage.from, movePackage.to);
    // try {
    // } catch (error) {
    //   console.error(`  ` + error.message);
    // }
  }
  console.log('  done');

  const movePackageBins = {
    from: path.join(tmpdir, 'node_modules', '.bin'),
    to: path.join(cwd, 'node_modules', '.bin'),
  };
  console.log(`Moving package .bins... \n  ${movePackageBins.from} -> \n  ${movePackageBins.to}`);
  try {
    await fs.move(movePackageBins.from, movePackageBins.to);
  } catch (error) {
    console.error('  ' + error.message);
  }
  console.log('  done');

  const movePackageModules = {
    from: path.join(tmpdir, 'node_modules'),
    to: path.join(cwd, 'node_modules', packageName, 'node_modules'),
  };
  console.log(`Moving package modules... \n  ${movePackageModules.from} -> \n  ${movePackageModules.to}`);
  try {
    await fs.rename(movePackageModules.from, movePackageModules.to);
  } catch (error) {
    console.error('  ' + error.message);
    try {
      await fs.move(movePackageModules.from, movePackageModules.to);
    } catch (error) {
      console.error('  ' + error.message);
    }
  }
  console.log('  done');

  console.log('Adding entry to package.json...');
  try {
    const newPackageJson = await getPackageJson(tmpdir);
    const oldPackageJson = await getPackageJson(cwd);
    const updatedPackageJson = { ...oldPackageJson };
    if (_.get(newPackageJson, `dependencies.${packageName}`)) {
      updatedPackageJson.dependencies = updatedPackageJson.dependencies || {};
      updatedPackageJson.dependencies[packageName] = newPackageJson.dependencies[packageName];
      updatedPackageJson.dependencies = sortObject(updatedPackageJson.dependencies);
    } else if (_.get(newPackageJson, `devDependencies.${packageName}`)) {
      updatedPackageJson.devDependencies = updatedPackageJson.devDependencies || {};
      updatedPackageJson.devDependencies[packageName] = newPackageJson.devDependencies[packageName];
      updatedPackageJson.devDependencies = sortObject(updatedPackageJson.devDependencies);
    }
    await outputPackageJson(cwd, updatedPackageJson);
  } catch (error) {
    console.error('  ' + error.message);
  }
  console.log('  done');


  console.log(`Removing ${tmpdir}...`);
  try {
    await fs.remove(tmpdir);
  } catch (error) {
    console.error('  ' + error.message);
  }
  console.log('  done');
}

