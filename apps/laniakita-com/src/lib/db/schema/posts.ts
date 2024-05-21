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
  postTags?: string[];
  postAuthors: string[];
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
  postAuthors: text('post_authors')
    .references(() => authors.name, { onUpdate: 'cascade', onDelete: 'cascade' })
    .notNull(),
  date: text('date').notNull(),
  headline: text('headline').unique().notNull(),
  subheadline: text('subheadline'),
  postTags: text('post_tags').references(() => tags.title, { onUpdate: 'cascade', onDelete: 'cascade' }),
  heroFile: text('hero_file'),
  heroCaption: text('hero_caption'),
  heroCredit: text('hero_credit'),
  heroCreditUrl: text('hero_credit_url'),
  heroCreditUrlText: text('hero_credit_url_text'),
  heroAltText: text('hero_alt_text'),
  rawContent: text('raw_content'),
  localKey: text('local_key'),
});

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

export const postsToAuthors = sqliteTable('posts_to_tags', 
  {
    postId: text('post_id').notNull().references(()=>posts.id),
    authorId: text('author_id').notNull().references(()=>authors.id)
  },
  (t) => ({
    pk: primaryKey({ columns: [t.postId, t.authorId] })
  }),
)

export const postsToAuthorsRelations = relations(postsToAuthors, ({ one }) => ({
  author: one(authors, {
    fields: [postsToAuthors.authorId],
    references: [authors.id],
  }),
}));

