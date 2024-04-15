import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';
import { authors } from './authors';
import { categories } from './categories';

export const authorsRelations = relations(authors, ({ many }) => ({
  posts: many(posts),
}));

export const categoryRelations = relations(categories, ({ many }) => ({
  posts: many(posts),
}));

export interface Posts {
  id: number;
  authorName: string;
  date: string;
  headline: string;
  subheadline?: string;
  category?: string;
  heroFile?: string;
  heroCredit?: string;
  heroCreditUrl?: string;
  heroCreditUrlText?: string;
  heroAltText?: string;
  rawContent?: string;
}

export const posts = sqliteTable('posts', {
  id: integer('id').primaryKey(),
  authorName: text('author_name')
    .references(() => authors.name, { onUpdate: 'cascade', onDelete: 'cascade' })
    .notNull(),
  date: text('date').notNull(),
  headline: text('headline').unique().notNull(),
  subheadline: text('subheadline'),
  category: text('category').references(() => categories.title, { onUpdate: 'cascade', onDelete: 'cascade' }),
  heroFile: text('hero_file'),
  heroCredit: text('hero_credit'),
  heroCreditUrl: text('hero_credit_url'),
  heroCreditUrlText: text('hero_credit_url_text'),
  heroAltText: text('hero_alt_text'),
  rawContent: text('raw_content'),
});

export const postsRelations = relations(posts, ({ one }) => ({
  author: one(authors, {
    fields: [posts.authorName],
    references: [authors.name],
  }),
  category: one(categories, {
    fields: [posts.category],
    references: [categories.title],
  }),
}));
