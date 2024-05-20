/* eslint-disable import/no-unresolved -- bun is provided by bun */
import { migrate } from 'drizzle-orm/bun-sqlite/migrator';
import { drizzle } from 'drizzle-orm/bun-sqlite';
import { Database } from 'bun:sqlite';

const sqlite = new Database('sqlite-main.db');
const maindb = drizzle(sqlite);
migrate(maindb, { migrationsFolder: './drizzle' });

sqlite.close();