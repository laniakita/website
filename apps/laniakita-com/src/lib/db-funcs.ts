import { maindb } from '@/lib/db/bun-db';
import { type Authors, authors } from '@/lib/db/schema/authors';
import { type Tags, tags } from '@/lib/db/schema/tags';

// Ideally instead of hard coded if statements, I could just match these
// functions with the priority.

export async function insertAuthors(authorData: Authors) {
  await maindb
    .insert(authors)
    .values({
      id: authorData.id,
      slug: authorData.slug,
      name: authorData.name,
      mastodon: authorData.mastodon,
      rawStr: authorData.rawStr,
    })
    .onConflictDoNothing();
}

export async function insertTags(tagData: Tags) {
  await maindb
    .insert(tags)
    .values({
      id: tagData.id,
      slug: tagData.slug,
      title: tagData.title,
      date: tagData.date,
      rawStr: tagData.rawStr,
    })
    .onConflictDoNothing();
}
