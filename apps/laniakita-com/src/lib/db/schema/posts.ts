import { sqliteTable, text, primaryKey } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';
import { authors } from './authors';
import { tags } from './tags';
import { featuredImages } from './featured-images';

export const authorsRelations = relations(authors, ({ many }) => ({
  posts: many(posts),
}));

export const featuredImagesRelations = relations(featuredImages, ({ many }) => ({
  posts: many(posts),
}));

export interface Posts {
  id: string;
  slug: string;
  date: string;
  tags: string[];
  author: string;
  headline: string;
  subheadline?: string;
  featuredImage: string;
  rawStr: string;
}

export const posts = sqliteTable('posts', {
  id: text('id').primaryKey(),
  authorId: text('author_id')
    .references(() => authors.id, { onUpdate: 'cascade', onDelete: 'cascade' })
    .notNull(),
  date: text('date').notNull(),
  slug: text('slug').unique().notNull(),
  headline: text('headline').unique().notNull(),
  subheadline: text('subheadline'),
  featuredImageId: text('featured_image_id').references(() => featuredImages.id, {
    onUpdate: 'cascade',
    onDelete: 'cascade',
  }),
  rawStr: text('raw_str'),
});

export const postsRelations = relations(posts, ({ one, many }) => ({
  author: one(authors, {
    fields: [posts.authorId],
    references: [authors.id],
  }),
  featuredImage: one(featuredImages, {
    fields: [posts.featuredImageId],
    references: [featuredImages.id],
  }),
  postToTags: many(postsToTags),
}));

export const postsToTags = sqliteTable(
  'posts_to_tags',
  {
    postId: text('post_id')
      .notNull()
      .references(() => posts.id, { onUpdate: 'cascade', onDelete: 'cascade' }),
    tagId: text('tag_id')
      .notNull()
      .references(() => tags.id, { onUpdate: 'cascade', onDelete: 'cascade' }),
  },
  (t) => {
    return {
      pk: primaryKey({ columns: [t.postId, t.tagId] }),
      //pk: primaryKey({ name: 'post_and_tag_id', columns: [t.postId, t.tagId] }),
    };
  },
);

export const postsToTagsRelations = relations(postsToTags, ({ one }) => ({
  tag: one(tags, {
    fields: [postsToTags.tagId],
    references: [tags.id],
  }),
  post: one(posts, {
    fields: [postsToTags.postId],
    references: [posts.id],
  }),
}));
