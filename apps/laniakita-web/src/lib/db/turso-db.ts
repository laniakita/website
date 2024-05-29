import 'dotenv/config';
import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import { Resource } from "sst";
import * as authors from './schema/authors';
import * as tags from './schema/tags';
import * as featuredImages from './schema/featured-images';
import * as posts from './schema/posts';


const client = createClient({
  url: Resource.TursoUrl.value,
  authToken: Resource.TursoAuth.value
});

export const maindb = drizzle(client, { schema: { ...authors, ...tags, ...featuredImages, ...posts } });
