#! /usr/bin/env bun

console.log('mdxlite v0.0.1')

if (typeof Bun === "undefined") {
  console.error('CRITICAL ERROR: Bun.sh missing! Did you forget to install bun?')
}

import { $, ShellOutput } from "bun"

const response = await $`ls`;

console.log(response.exitCode)
  




