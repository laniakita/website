import { compareDesc } from 'date-fns';
import { toXML } from 'jstoxml';
import versionVault from 'versionVault/compiled';
import { allTags, allCategories } from 'contentlayer/generated';
import type { Tag, Category, Post } from 'contentlayer/generated';
import type { FeaturedImageR1 } from '@/lib/image-process';
import { APP_URL, BLOG_DESCR } from '@/lib/constants';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

export const dynamic = 'force-static';

const xmlOpts = {
  header: true,
  indent: '  ',
};

export async function GET() {
  const NEXTJS_VERSION = versionVault.versions.dependencies.next;

  const allPostData = await readFile(join(process.cwd(), '.contentlayerplushtml/generated/Post/index.json'), {
    encoding: 'utf8',
  });

  interface PostPlus extends Post {
    html: string;
  }

  const allPosts = JSON.parse(allPostData) as PostPlus[];

  const posts = allPosts.sort((a, b) => compareDesc(new Date(a.updated ?? a.date), new Date(b.updated ?? b.date)));
  const buildDate = new Date(
    posts.length >= 1 && posts[0] !== undefined ? (posts[0].updated ?? posts[0]?.date) : '',
  ).toISOString();

  const HOST_URL = APP_URL;

  const catTagRoller = (catsTagArr: Category[] | Tag[]) => {
    const res = catsTagArr.map((catTagX) => {
      const catTag = {
        _name: 'category',
        _attrs: [
          {
            term: catTagX.slug,
          },
          {
            scheme: `${HOST_URL}${catTagX.url}`,
          },
          {
            label: catTagX.title,
          },
        ],
      };
      return catTag;
    });

    return res;
  };

  const postEntry = posts.map((post) => {
    const cats =
      post.categories &&
      (
        (post.categories as unknown as { slug: string }[]).map((cat) => {
          const category = allCategories.find((categoryX) => categoryX._raw.flattenedPath === `categories/${cat.slug}`);

          return category;
        }) as Category[]
      ).sort((a, b) => a.title.localeCompare(b.title));

    const tagsArr =
      post.tags &&
      (
        (post.tags as unknown as { slug: string }[]).map((tag) => {
          const tagY = allTags.find((tagX) => tagX._raw.flattenedPath === `tags/${tag.slug}`);

          return tagY;
        }) as Tag[]
      ).sort((a, b) => a.title.localeCompare(b.title));

    const resCats = cats && catTagRoller(cats);
    const resTags = tagsArr && catTagRoller(tagsArr);

    const imgEmbed = (post.featured_image as FeaturedImageR1).hasImage
      ? `
          <figure>
            <img src="${HOST_URL}${(post.featured_image as FeaturedImageR1).src}" alt="${(post.featured_image as FeaturedImageR1).altText}" />
            <figcaption>${(post.featured_image as FeaturedImageR1).caption}</figcaption>
          </figure>
        `
      : `
          <figure>
            <img src="${HOST_URL}/opengraph${post.url}" alt="${post.headline}" />
            <figcaption>${post.caption ?? post.subheadline ?? post.headline}</figcaption>
          </figure>
        `;

    const res = [
      {
        title: post.headline,
      },
      {
        _name: 'link',
        _attrs: [
          {
            rel: 'alternate',
          },
          {
            href: `${HOST_URL}${post.url}`,
          },
        ],
      },
      {
        id: `${HOST_URL}${post.url}`,
      },
      {
        updated: new Date(post.updated ?? post.date).toISOString(),
      },
      resCats,
      resTags,
      {
        _name: 'content',
        _attrs: {
          type: 'html',
        },
        _content: `<![CDATA[${imgEmbed} ${post.html} ]]>`,
      },
    ];
    return { entry: res };
  });

  const atomFeed = {
    _name: 'feed',
    _attrs: {
      xmlns: 'http://www.w3.org/2005/Atom',
    },
    _content: [
      {
        title: `Yet Another Dev Blog, by Lani Akita`,
      },
      {
        _name: 'link',
        _attrs: [
          {
            href: `${HOST_URL}/atom.xml`,
          },
          {
            rel: 'self',
          },
        ],
      },
      {
        _name: 'link',
        _attrs: {
          href: `${HOST_URL}/blog`,
        },
      },
      {
        updated: buildDate,
      },
      {
        _name: 'author',
        _content: [
          {
            name: 'Lani Akita',
          },
          {
            email: 'lani@laniakita.com',
          },
          {
            uri: `${HOST_URL}/about`,
          },
        ],
      },

      {
        _name: 'category',
        _attrs: [
          {
            term: 'technology',
          },
          {
            label: 'Technology',
          },
        ],
      },
      {
        _name: 'generator',
        _attrs: {
          version: NEXTJS_VERSION,
        },
        _content: 'Next.js',
      },
      {
        icon: `${HOST_URL}/favicon.ico`,
      },
      {
        logo: `${HOST_URL}/icon1.svg`,
      },
      {
        rights: `Copyright © ${new Date().getFullYear() === 2024 ? '2024' : `2024-${new Date().getFullYear()}`}, Lani Akita`,
      },
      {
        subtitle: BLOG_DESCR,
      },
      {
        id: `${HOST_URL}/blog`,
      },
      postEntry,
    ],
  };

  const feedXml = toXML(atomFeed, xmlOpts);

  return new Response(feedXml, {
    headers: {
      'Content-Type': 'text/xml',
    },
  });
}
