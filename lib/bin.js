#!/usr/bin/env node

import main from './index.js';
import config from './config.js';
import { Error } from './utils.js';

main(config).catch((error) => {
  if (error instanceof Error) console.error(error.message || error);
  else console.error(error);
  process.exitCode = 1;
});
