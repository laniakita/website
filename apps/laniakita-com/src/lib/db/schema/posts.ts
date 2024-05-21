import { sqliteTable, text, primaryKey } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';
import { authors } from './authors';
import { tags } from './tags';

export const authorsRelations = relations(authors, ({ many }) => ({
  posts: many(posts),
}));

export const categoryRelations = relations(tags, ({ many }) => ({
  posts: many(posts),
}));

export interface Posts {
  id: string;
  date: string;
  postAuthor: string;
  slug: string;
  headline: string;
  subheadline?: string;
  heroFile?: string;
  heroCaption?: string;
  heroCredit?: string;
  heroCreditUrl?: string;
  heroCreditUrlText?: string;
  heroAltText?: string;
  rawContent?: string;
  localKey?: string;
}

export const posts = sqliteTable('posts', {
  id: text('id').primaryKey(),
  authorId: text('author_id')
    .references(() => authors.id, { onUpdate: 'cascade', onDelete: 'cascade' })
    .notNull(),
  date: text('date').notNull(),
  headline: text('headline').unique().notNull(),
  subheadline: text('subheadline'),
  heroFile: text('hero_file'),
  heroCaption: text('hero_caption'),
  heroCredit: text('hero_credit'),
  heroCreditUrl: text('hero_credit_url'),
  heroCreditUrlText: text('hero_credit_url_text'),
  heroAltText: text('hero_alt_text'),
  rawContent: text('raw_content'),
  localKey: text('local_key'),
});

export const postsRelations = relations(posts, ({ one, many }) => ({
  author: one(authors, {
    fields: [posts.authorId],
    references: [authors.id],
  }),
  postToTags: many(postsToTags)
}));

export const postsToTags = sqliteTable('posts_to_tags', 
  {
    postId: text('post_id').notNull().references(()=>posts.id),
    tagId: text('tag_id').notNull().references(()=>tags.id)
  },
  (t) => ({
    pk: primaryKey({ columns: [t.postId, t.tagId] })
  }),
);

export const postsToTagsRelations = relations(postsToTags, ({ one }) => ({
  tag: one(tags, {
    fields: [postsToTags.tagId],
    references: [tags.id],
  }),
}));



