import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';

export interface Category {
  id: number;
  title: string;
  description?: string;
}

export const category = sqliteTable('category', {
  id: integer('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
});
