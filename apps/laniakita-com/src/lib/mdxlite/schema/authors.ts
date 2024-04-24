import { sqliteTable, text } from 'drizzle-orm/sqlite-core';

export interface Authors {
  id: string;
  name: string;
  mastodon?: string;
  rawContent?: string;
  localKey?: string;
}

export const authors = sqliteTable('authors', {
  id: text('id').primaryKey(),
  name: text('name').unique(),
  mastodon: text('mastodon'),
  rawContent: text('raw_content'),
  localKey: text('local_key') 
});
