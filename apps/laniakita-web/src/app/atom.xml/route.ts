import { compareDesc } from 'date-fns';
import { allPosts } from 'contentlayer/generated';
import versionVault from 'versionVault/compiled';

// opts
const buildDate = new Date().toISOString();
const xmlOpts = {
  header: true,
  indent: '  ',
};

// data
const NEXTJS_VERSION = packageVersionSaver.versions.dependencies.next as string;
const posts = allPosts.sort((a, b) => compareDesc(new Date(a.date), new Date(b.date)));

console.log(NEXTJS_VERSION);

export async function GET() {
  return new Response(`XML CONTENT`, {
    headers: {
      'Content-Type': 'text/xml',
    },
  });
}
