import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export interface Tags {
  id: string;
  slug: string;
  date: Date;
  title: string;
  localKey: string;
  rawStr?: string;
}

export const tags = sqliteTable('tags', {
  id: text('id').primaryKey(),
  slug: text('slug').unique(),
  date: integer('date', { mode: 'timestamp' }),
  title: text('title').unique(),
  localKey: text('local_key'),
  rawStr: text('raw_str'),
});
