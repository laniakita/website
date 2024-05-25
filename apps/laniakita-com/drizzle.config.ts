import path from 'node:path';
import 'dotenv/config';
import type { Config } from 'drizzle-kit';

export default {
  schema: './src/lib/db/schema/*',
  out: './drizzle',
  dialect: 'sqlite',
  dbCredentials: {
    url: path.join(process.cwd(), 'sqlite-main.db'),
  },
  verbose: true,
} satisfies Config;
