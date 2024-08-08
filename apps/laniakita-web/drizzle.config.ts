/* eslint-disable import/no-extraneous-dependencies -- false positive from sst */
import * as dotenv from 'dotenv';
import type { Config } from 'drizzle-kit';
import { Resource } from 'sst';

dotenv.config();

/* local config
import path from 'node:path';
export default {
  schema: './src/lib/db/schema/*',
  out: './drizzle',
  dialect: 'sqlite',
  dbCredentials: {
    url: path.join(process.cwd(), 'sqlite-main.db'),
  },
  verbose: true,
} satisfies Config;
*/

export default {
  schema: './src/lib/db/schema/*',
  out: './drizzle/migrations',
  dialect: 'sqlite',
  driver: 'turso',
  dbCredentials: {
    url: Resource.TursoUrl.value,
    authToken: Resource.TursoAuth.value
    //url: process.env.TURSO_DATABASE_URL!,
    //authToken: process.env.TURSO_AUTH_TOKEN,
  },
} satisfies Config;
