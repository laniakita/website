import { sqliteTable, text } from 'drizzle-orm/sqlite-core';

export interface Tags {
  id: string;
  slug: string;
  title: string;
  rawContent?: string;
  localKey?: string;
}

export const tags = sqliteTable('tags', {
  id: text('id').primaryKey(),
  slug: text('slug').unique().notNull(),
  title: text('title').unique().notNull(),
  rawContent: text('raw_content'),
  localKey: text('local_key'),
});
