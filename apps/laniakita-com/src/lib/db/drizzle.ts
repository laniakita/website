/* eslint-disable import/no-named-as-default -- better-sqlite3 documents this as the official way  */
import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as authors from './schema/authors';
import * as categories from './schema/categories';
import * as posts from './schema/posts';

const sqlite = new Database('sqlite-main.db');
export const maindb = drizzle(sqlite, { schema: { ...authors, ...categories, ...posts } });
