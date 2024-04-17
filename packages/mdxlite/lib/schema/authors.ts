import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';

export interface Authors {
  id: number;
  name: string;
  bio?: string;
  mastodon?: string;
}

export const authors = sqliteTable('authors', {
  id: integer('id').primaryKey(),
  name: text('name').unique(),
  bio: text('bio'),
  mastodon: text('mastodon'),
});
