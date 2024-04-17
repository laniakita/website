#! /usr/bin/env bun

console.log("mdxlite v0.0.1");

if (typeof Bun === "undefined") {
  console.error(
    "CRITICAL ERROR: Bun.sh missing! Did you forget to install bun?",
  );
}

import {  parseArgs } from "util";

const { values, positionals } = parseArgs({
  args: Bun.argv,
  options: {
    flag1: {
      type: "boolean",
    },
    flag2: {
      type: "string",
    },
  },
  strict: true,
  allowPositionals: true,
});

console.log(values);
console.log(positionals);
