import { sqliteTable, text } from 'drizzle-orm/sqlite-core';

export interface Authors {
  id: string;
  slug: string;
  date: Date;
  name: string;
  mastodon?: string;
  mastodonURL?: string;
  rawStr?: string;
}

export const authors = sqliteTable('authors', {
  id: text('id').primaryKey(),
  slug: text('slug').unique().notNull(),
  date: text('date'),
  name: text('name'),
  mastodon: text('mastodon'),
  mastodonURL: text('mastodon_url'),
  rawStr: text('raw_str'),
});
