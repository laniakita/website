import { drizzle } from 'drizzle-orm/bun-sqlite';
import * as authors from './schema/authors';
import * as categories from './schema/categories';
import * as posts from './schema/posts';
import { Database } from 'bun:sqlite';

// todo custom schemas via config file

const sqlite = new Database('mdxlite.db');
const mdxlitedb = drizzle(sqlite, { schema: { ...authors, ...categories, ...posts } });
export default mdxlitedb;
