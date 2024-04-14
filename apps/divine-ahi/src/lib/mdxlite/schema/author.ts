import { sqliteTable, integer, text, } from "drizzle-orm/sqlite-core"

export interface Author {
  id: number,
  name: string,
  bio?: string,
  mastodon?: string
}

export const author = sqliteTable('author', {
  id: integer('id').primaryKey(),
  name: text('name').notNull(),
  bio: text('bio'),
  mastodon: text('mastodon')
});

