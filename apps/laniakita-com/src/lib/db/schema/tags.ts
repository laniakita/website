import { sqliteTable, text } from 'drizzle-orm/sqlite-core';

export interface Tags {
  id: string;
  slug: string;
  date: Date;
  title: string;
  rawStr?: string;
}

export const tags = sqliteTable('tags', {
  id: text('id').primaryKey(),
  slug: text('slug').unique(),
  date: text('date'),
  title: text('title').unique(),
  rawStr: text('raw_str'),
});
