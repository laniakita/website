/* eslint-disable import/no-named-as-default -- better-sqlite3 documents this as the official way  */
import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as authors from './schema/authors';
import * as tags from './schema/tags';
import * as posts from './schema/posts';
import * as featuredImages from './schema/featured-images';


const sqlite = new Database('sqlite-main.db');
export const maindb = drizzle(sqlite, { schema: { ...authors, ...tags, ...featuredImages, ...posts } });
