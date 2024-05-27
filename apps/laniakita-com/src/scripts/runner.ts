/* eslint-disable no-console -- bun is bun */
import 'dotenv/config';
import dbGen from './db-gen';
import rssGen from './rss-gen';

const runScripts = async (): Promise<void> => {
  try {
    console.log('trying to create database');
    await dbGen();
    console.log('dbGen success');
    await rssGen();
    console.log('rssGen success');
  } catch (err) {
    console.error(err);
  }
};

try {
  await runScripts();
} catch (err) {
  console.error(err)
}
