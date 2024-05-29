import * as dotenv from 'dotenv';
import { Resource } from 'sst';
import type { Config } from 'drizzle-kit';

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
    authToken: Resource.TursoAuth.value,
  },
} satisfies Config;
