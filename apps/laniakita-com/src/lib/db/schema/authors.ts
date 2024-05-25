import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { string } from 'three/examples/jsm/nodes/Nodes.js';

export interface Authors {
  id: string;
  slug: string;
  date: Date;
  name: string;
  mastodon?: string;
  mastodonURL?: string;
  localKey: string;
  rawStr: string;
}

export const authors = sqliteTable('authors', {
  id: text('id').primaryKey(),
  slug: text('slug').unique().notNull(),
  date: text('date'),
  name: text('name'),
  mastodon: text('mastodon'),
  mastodonURL: text('mastodon_url'),
  localKey: text('local_key'),
  rawStr: text('raw_str'),
});
