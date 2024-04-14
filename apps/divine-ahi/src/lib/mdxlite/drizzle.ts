import {drizzle} from 'drizzle-orm/better-sqlite3'
// eslint-disable-next-line -- 'better-sqlite3' doesn't ship modules & @types/better-sqlite3 is outdated.
import Database from 'better-sqlite3'

const sqlite = new Database('mdxlite.db');
const mdxlitedb = drizzle(sqlite);
export default mdxlitedb
