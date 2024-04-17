/* eslint-disable import/no-unresolved -- bun is bun */
import { migrate } from "drizzle-orm/bun-sqlite/migrator";
import { drizzle } from "drizzle-orm/bun-sqlite";
import { Database } from "bun:sqlite";

const sqlite = new Database("mdxlite.db");
const db = drizzle(sqlite);
migrate(db, { migrationsFolder: "./drizzle" });

sqlite.close()
