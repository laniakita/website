import { sqliteTable, text } from 'drizzle-orm/sqlite-core';

export interface Tags {
  id: string;
  slug: string;
  title: string;
  rawStr?: string;
}

export const tags = sqliteTable('tags', {
  id: text('id').primaryKey(),
  slug: text('slug').unique().notNull(),
  title: text('title').unique().notNull(),
  rawStr: text('raw_str'),
});
