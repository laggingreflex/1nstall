import path from 'path';
import { exec } from './child-process';
import {
  generateTempDir,
  outputPackageJson,
} from './fs';

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
      args.push('--saveDev');
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

