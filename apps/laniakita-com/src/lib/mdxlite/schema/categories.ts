import { sqliteTable, text } from 'drizzle-orm/sqlite-core';

export interface Categories {
  id: string;
  title: string;
  rawContent?: string;
}

export const categories = sqliteTable('categories', {
  id: text('id').primaryKey(),
  title: text('title').unique().notNull(),
  rawContent: text('raw_content'),
});
