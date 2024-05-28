/* eslint-disable no-console -- bun is bun */
import 'dotenv/config';
import dbGen from './db-gen';
import atomGen from './atom-gen';

const runScripts = async (): Promise<void> => {
  try {
    console.log('trying to create database');
    await dbGen();
    console.log('dbGen success');
    await atomGen();
    console.log('atomGen success');
  } catch (err) {
    console.error(err);
  }
};

try {
  await runScripts();
} catch (err) {
  console.error(err);
}
