import { spawn } from 'child_process'
import OS from 'os';
import URL from 'url';
import Path from 'path';
import fs from 'fs-extra';

class Error1nstall extends Error {
  constructor(message, data) {
    super(message);
    Object.assign(this, data, this);
  }
}

export { Error1nstall as Error };

export function arrify(thing) {
  if (Array.isArray(thing)) return thing;
  if (typeof thing === undefined) return [];
  return [thing];
}

export function splitCommandStr(commandStr) {
  const [command, ...args] = commandStr.trim().split(/[\s]+/g);
  return [command, args];
}

export function exec(command, args, { cwd, env, shell = true } = {}) {
  console.log('Executing:', command, ...args);
  const cp = spawn(command, args.filter(Boolean), {
    stdio: 'inherit',
    cwd,
    env: { ...process.env, ...env, },
    shell,
  });
  return new Promise((resolve, reject) => {
    cp.on('exit', code => {
      if (code) {
        reject(new Error(`Process exiting with error code: ${code}`, { code }));
      } else {
        resolve();
      }
    });
  });
}

export function generateID() {
  return 'xxxxxxxx'
    .replace(/x/g, x => Math.random()
      .toString(36)
      .replace(/[^a-z]+/g, '')
      .substr(0, 1)
    )
}

export function generateTempDir() {
  return Path.join(OS.tmpdir(), '1nstall', generateID());
}

export function getPackageJson(dir) {
  const file = Path.join(dir, 'package.json');
  console.log(`Reading ${file}...`);
  return fs.readJson(file);
}

export async function outputPackageJson(dir, data) {
  const file = Path.join(dir, 'package.json');
  const fileBkp = Path.join(dir, `package.bkp.${Date.now() + 0}.json`);
  try {
    await fs.copy(file, fileBkp);
  } catch (err) {}
  console.log(`Creating ${file}...`);
  await fs.outputJson(file, data, { spaces: 2 });
  await fs.remove(fileBkp);
}

export async function moveNew({ package: packageLiteral, cwd, tmpdir, debug = false, force = false }) {
  const [packageName] = packageLiteral.split(/@/);
  console.log({ packageLiteral, packageName })
  return

  await moveNodeModules(packageName);

  async function moveNodeModules(packageName) {
    await moveHelper(
      Path.join(tmpdir, 'node_modules', packageName),
      Path.join(cwd, 'node_modules', packageName),
    );
  }

  async function moveHelper(from, to) {
    console.log(`Moving ${commonPathString(from, to)}`);

  }
}

function commonPathString(a, b, { sep = Path.sep } = {}) {
  const commonPath = findCommonPath(a, b);
  const pathString = [
    '(',
    [a, b]
    .map(x => x
      .replace(commonPath, '')
      .replace(/[\/\\]+$/, '')
    ).join(' -> '),
    // a.replace(commonPath, ''),
    // ' -> ',
    // b.replace(commonPath, ''),
    ')',
    sep,
    commonPath,
  ];
  return pathString.join('');
}

function findCommonPath(a_, b_, { sep = Path.sep } = {}) {
  const [a, b] = [a_, b_].map(x => x.split(/[\/\\]+/g).reverse());
  const common = [];
  const length = Math.min(a.length, b.length);
  for (let i = 0; i < length; i++) {
    if (a[i] === b[i]) {
      common.push(a[i])
    } else {
      break;
    }
  }
  // console.log(`common:`, common)
  return common.reverse().join(sep);
}

export async function move({ package: packageLiteral, cwd, tmpdir, debug = false, force = false }) {
  // const [packageName] = packageLiteral.split(/@/);
  let packageName = packageLiteral;
  if (packageName.startsWith('@')) {
    // scope - do nothing
  } else if (packageName.includes('@')) {
    // remove version
    [packageName] = packageName.split(/@/);
  }

  const movePackage = {
    from: Path.join(tmpdir, 'node_modules', packageName),
    to: Path.join(cwd, 'node_modules', packageName),
  };
  console.log(`Moving package... \n  ${movePackage.from} -> \n  ${movePackage.to}`);
  if (await fs.pathExists(movePackage.to)) {
    if (force) {
      console.log('Removing existing dir:', movePackage.to);
      await fs.remove(movePackage.to);
    } else {
      console.log('Package already exists:', movePackage.to);
      console.log('Use --force to remove');
    }
  }
  try {
    await fs.mkdirp(Path.join(movePackage.to, '..'));
  } catch (error) {
    console.error('  ' + error.message);
  }
  try {
    await fs.rename(movePackage.from, movePackage.to);
  } catch (error) {
    console.error('  ' + error.message);
    console.log('  Couldn\'t rename, actually moving...');
    await fs.move(movePackage.from, movePackage.to);
    // try {
    // } catch (error) {
    //   console.error(`  ` + error.message);
    // }
  }
  console.log('  done');

  const movePackageBins = {
    from: Path.join(tmpdir, 'node_modules', '.bin'),
    to: Path.join(cwd, 'node_modules', '.bin'),
  };
  console.log(`Moving package .bins... \n  ${movePackageBins.from} -> \n  ${movePackageBins.to}`);
  try {
    await fs.move(movePackageBins.from, movePackageBins.to);
  } catch (error) {
    console.error('  ' + error.message);
  }
  console.log('  done');

  const movePackageModules = {
    from: Path.join(tmpdir, 'node_modules'),
    to: Path.join(cwd, 'node_modules', packageName, 'node_modules'),
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
    // if (_.get(newPackageJson, `dependencies.${packageName}`)) {
    if (newPackageJson?.dependencies?. [packageName]) {
      updatedPackageJson.dependencies = updatedPackageJson.dependencies || {};
      updatedPackageJson.dependencies[packageName] = newPackageJson.dependencies[packageName];
      updatedPackageJson.dependencies = sortObject(updatedPackageJson.dependencies);
      // } else if (_.get(newPackageJson, `devDependencies.${packageName}`)) {
    } else if (newPackageJson?.devDependencies?. [packageName]) {
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

export function sortObject(oldObject) {
  const keys = Object.keys(oldObject);
  keys.sort();
  const newObject = {};
  for (const key of keys) {
    newObject[key] = oldObject[key];
  }
  return newObject;
}

export async function install({ package: packageLiteral, yarn, tmpdir, saveDev = false } = {}) {
  tmpdir = tmpdir || generateTempDir();
  const [packageName, packageVersion] = packageLiteral.split(/@/);
  await outputPackageJson(tmpdir, {});
  console.log(`Installing ${packageLiteral}...`);
  let command, args;
  if (!yarn) {
    command = 'npm';
    args = ['install'];
    if (saveDev) {
      args.push('--save-dev');
    } else {
      args.push('--save');
    }
    args.push(packageLiteral);
  } else {
    command = 'yarn';
    args = ['add'];
    if (saveDev) {
      args.push('--dev');
    }
    args.push(packageLiteral);
  }
  await exec(command, args, { cwd: tmpdir });
  return tmpdir;
}
