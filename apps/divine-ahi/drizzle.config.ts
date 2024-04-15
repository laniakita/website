import 'dotenv/config';
import type { Config } from 'drizzle-kit';

export default {
  schema: './src/lib/mdxlite/schema/*',
  out: './drizzle',
  driver: 'better-sqlite',
  dbCredentials: {
    url: 'mdxlite.db',
  },
  verbose: true,
} satisfies Config;