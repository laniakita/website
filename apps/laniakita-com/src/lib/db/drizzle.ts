import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as authors from './schema/authors';
import * as categories from './schema/categories';
import * as posts from './schema/posts';

import Database from 'better-sqlite3';

const sqlite = new Database('sqlite-main.db');
const maindb = drizzle(sqlite, { schema: { ...authors, ...categories, ...posts } });
export default maindb;