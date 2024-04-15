import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';

export interface Categories {
  id: number;
  title: string;
  description?: string;
}

export const categories = sqliteTable('categories', {
  id: integer('id').primaryKey(),
  title: text('title').unique().notNull(),
  description: text('description'),
});
