import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';

export interface HeroImage {
  id: number;
  file: string;
  altText: string;
  credit?: string;
  creditUrl?: string;
  creditUrlText?: string;
}

export const heroImage = sqliteTable('hero_image', {
  id: integer('id').primaryKey(),
  file: text('file').notNull(),
  altText: text('alt_text').notNull(),
  credit: text('credit'),
  creditUrl: text('credit_url'),
  creditUrlText: text('credit_url_text'),
});
