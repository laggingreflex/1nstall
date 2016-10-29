
# 1nstall
[![npm](https://img.shields.io/npm/v/1nstall.svg)](https://www.npmjs.com/package/1nstall)

Install a package as if it was the only package.

## Why?

Does installing a new package take a lot of time when you have a lot of `node_modules` already installed? Even with yarn!?

Here's en example: adding a package `jquery`, which itself has no dependencies and is a tiny module, in a project which already has a bunch of dependencies, takes just as much time as re-installing them all:

![][without.gif]

[without.gif]: misc/without.gif

It's basically re-installing/liking ***all*** dependencies!

Not anymore! Here's an example adding the same `jquery` package with 1nstall:

![][one.gif]

[one.gif]: misc/one.gif

Did you see that? [You wish you saw that!][moss]

[moss]: https://www.youtube.com/watch?v=ZeK4ksWxhRc

## How?

It installs the package it in a temporary location:

```
C:\…\temp\xyzuuid
└───node_modules
    ├───.bin
    │   └───jquery.cmd
    ├───jquery <<
    └───others
```
(pretend that jquery comes with a binary and `others` dependencies)

Then it moves\* the installed package:
```
C:\…\temp\xyzuuid\node_modules\jquery -> from
C:\…\your-project\node_modules\jquery <- to
```
(\*for better performance (at least on Windows) it tries to rename first, if that fails it actually moves it. You may see an EPERM error if/when the rename fails.)

Then it moves the dependencies (rest of the `node_modules`) on the *inside* the installed package:
```
C:\…\temp\xyzuuid\node_modules ->
C:\…\your-project\node_modules\jquery\node_modules <- to
```

It also moves the `.bin`s:
```
C:\…\temp\xyzuuid\node_modules\.bin\* ->
C:\…\your-project\node_modules\.bin\* <- to
```

And last but not the least, adds the entry in your `package.json`

## Usage

```
npm install -g 1nstall
# to use yarn make sure you have it too
npm install -g yarn
```

Use with `npm` or `yarn`:

```
one jquery
# or
one npm --saveDev jquery
# or
one yarn --dev jquery
# or
one y jquery
```

## Caveats

* It's only beneficial when the installing package is actually smaller (dependencies included) than your project. Which usually is the case.

* It currently only updates `package.json` not `yarn.lock` file. If you used yarn it will still update `package.json`.

