/* eslint-disable import/no-unresolved -- bun is provided by bun */
import { drizzle } from 'drizzle-orm/bun-sqlite';
import { Database } from 'bun:sqlite';
import * as authors from './schema/authors';
import * as categories from './schema/categories';
import * as posts from './schema/posts';

// todo custom schemas via config file

const sqlite = new Database('sqlite-main.db');
const maindb = drizzle(sqlite, { schema: { ...authors, ...categories, ...posts } });

export default maindb;