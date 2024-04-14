import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';
import { author } from './author';
import { heroImage } from './hero-image';
import { category } from './category';

export interface Post {
  id: number;
  author: string;
  date: string;
  headline: string;
  subheadline?: string;
  category?: string;
  heroFile?: string;
  heroCredit?: string;
  heroCreditUrl?: string;
  heroCreditUrlText?: string;
  heroAltText?: string;
  content?: string;
}

export const post = sqliteTable('post', {
  id: integer('id').primaryKey(),
  author: text('author').references(() => author.name).notNull(),
  date: text('date').notNull(),
  headline: text('headline').notNull(),
  subheadline: text('subheadline'),
  category: text('category').references(() => category.title),
  heroFile: text('hero_file').references(() => heroImage.file),
  heroCredit: text('hero_credit').references(() => heroImage.credit),
  heroCreditUrl: text('hero_credit_url').references(() => heroImage.creditUrl),
  heroCreditUrlText: text('hero_credit_url_text').references(() => heroImage.creditUrlText),
  heroAltText: text('hero_alt_text').references(() => heroImage.altText),
  content: text('content'),
});

