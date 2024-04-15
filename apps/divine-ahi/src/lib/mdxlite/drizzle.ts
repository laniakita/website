import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as authors from '@/lib/mdxlite/schema/authors';
import * as categories from '@/lib/mdxlite/schema/categories';
import * as posts from '@/lib/mdxlite/schema/posts';
// eslint-disable-next-line -- 'better-sqlite3' doesn't ship modules & @types/better-sqlite3 is outdated.
import Database from 'better-sqlite3';

const sqlite = new Database('mdxlite.db');
const mdxlitedb = drizzle(sqlite, { schema: { ...authors, ...categories, ...posts } });
export default mdxlitedb;
