#! /usr/bin/env bun
import {  parseArgs } from "util";

const { values, positionals } = parseArgs({
  args: Bun.argv,
  options: {
    "content-folder": {
      type: "string",
    },
  },
  strict: true,
  allowPositionals: true,
});

console.log(values);
console.log(positionals);
