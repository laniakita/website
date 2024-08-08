/* eslint-disable import/no-extraneous-dependencies -- false positive from sst */
import * as dotenv from 'dotenv';
import { drizzle } from 'drizzle-orm/libsql';
import { Resource } from 'sst';
import { createClient } from '@libsql/client';
import * as authors from './schema/authors';
import * as tags from './schema/tags';
import * as featuredImages from './schema/featured-images';
import * as posts from './schema/posts';

dotenv.config();

const client = createClient({
  url: Resource.TursoUrl.value,
  authToken: Resource.TursoAuth.value
  //url: process.env.TURSO_DATABASE_URL!,
  //authToken: process.env.TURSO_AUTH_TOKEN,
});

export const maindb = drizzle(client, { schema: { ...authors, ...tags, ...featuredImages, ...posts } });
