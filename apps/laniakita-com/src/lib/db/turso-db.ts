import 'dotenv/config';
import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as authors from './schema/authors';
import * as tags from './schema/tags';
import * as featuredImages from './schema/featured-images';
import * as posts from './schema/posts';

const client = createClient({
  url: process.env.TURSO_CONNECTION_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

export const maindb = drizzle(client, { schema: { ...authors, ...tags, ...featuredImages, ...posts } });
