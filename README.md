
# 1nstall
[![npm](https://img.shields.io/npm/v/1nstall.svg)](https://www.npmjs.com/package/1nstall)

Install a package as if it was the only package.

## Why?

Does installing a new dependency take a lot of time when you have a lot of `node_modules` already installed?

## How?

It installs the dependency it in a temporary location then it moves\* it to your project, along with `.bin`s, and updated your `package.json`.

## Usage

```
npm install -g 1nstall
```
```
one jquery
# or
one npm --saveDev jquery
```

## Caveats

* It's only beneficial when the installing package is actually smaller (dependencies included) than your project. Which usually is the case.

* It only updates `package.json` not `package-lock.json` file.
