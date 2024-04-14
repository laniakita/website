import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';
import { authors } from './authors';
import { categories } from './categories';

export interface Posts {
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

export const posts = sqliteTable('posts', {
  id: integer('id').primaryKey(),
  author: text('author').references(() => authors.name).notNull(),
  date: text('date').notNull(),
  headline: text('headline').unique().notNull(),
  subheadline: text('subheadline'),
  category: text('category').references(() => categories.title),
  heroFile: text('hero_file'),
  heroCredit: text('hero_credit'),
  heroCreditUrl: text('hero_credit_url'),
  heroCreditUrlText: text('hero_credit_url_text'),
  heroAltText: text('hero_alt_text'),
  content: text('content'),
});

