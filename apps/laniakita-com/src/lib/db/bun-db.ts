/* eslint-disable import/no-unresolved -- bun is provided by bun */
import { drizzle } from 'drizzle-orm/bun-sqlite';
import { Database } from 'bun:sqlite';
import * as authors from './schema/authors';
import * as tags from './schema/tags';
import * as featuredImages from './schema/featured-images';
import * as posts from './schema/posts';

// todo custom schemas via config file

const sqlite = new Database('sqlite-main.db');
export const maindb = drizzle(sqlite, { schema: { ...authors, ...tags, ...featuredImages, ...posts } });
