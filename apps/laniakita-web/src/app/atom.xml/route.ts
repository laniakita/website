import { headers } from 'next/headers';
import { compareDesc } from 'date-fns';
import { toXML } from 'jstoxml';
import allPosts from 'contentlayermini/Post/index.json'
import allTags from 'contentlayermini/Tag/index.json'
import allCategories from 'contentlayermini/Category/index.json'
import type { Tag, Post, Category } from 'contentlayer/generated';
import versionVault from 'versionVault/compiled';
import type { FeaturedImageR1 } from '@/lib/image-process';
import { BLOG_DESCR } from '@/lib/constants';
// opts
const xmlOpts = {
  header: true,
  indent: '  ',
};

export const runtime = 'edge'

export function GET() {

  const buildDate = new Date().toISOString();
  const NEXTJS_VERSION = versionVault.versions.dependencies.next;
  const posts = allPosts.sort((a, b) => compareDesc(new Date(a.date), new Date(b.date))) as unknown as Post[] | undefined;

  const headersList = headers();
  const host = headersList.get('host');
  const protocol = process.env.NODE_ENV === 'production' ? 'https://' : 'http://';
  const HOST_URL = `${protocol}${host}`;

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

  const postEntry = posts?.map((post) => {
    const cats =
      post.categories &&
      (
        (post.categories as unknown as { slug: string }[]).map((cat) => {
          const category = allCategories.find((categoryX) => categoryX._raw.flattenedPath === `categories/${cat.slug}`);

          return category;
        }) as Category[]
      ).sort((a, b) => a.title!.localeCompare(b.title!));

    const tagsArr =
      post.tags &&
      (
        (post.tags as unknown as { slug: string }[]).map((tag) => {
          const tagY = allTags.find((tagX) => tagX._raw.flattenedPath === `tags/${tag.slug}`);

          return tagY;
        }) as Tag[]
      ).sort((a, b) => a.title!.localeCompare(b.title!));

    const resCats = cats && catTagRoller(cats);
    const resTags = tagsArr && catTagRoller(tagsArr);

    const imgEmbed =
      (post.featured_image as FeaturedImageR1).hasImage &&
      `<figure>
         <img src="${HOST_URL}${(post.featured_image as FeaturedImageR1).src}" alt="${(post.featured_image as FeaturedImageR1).altText}" />
         <figcaption>${(post.featured_image as FeaturedImageR1).caption}}</figcaption>
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
        updated: new Date(post.date.toString()).toISOString(),
      },
      resCats,
      resTags,
      {
        _name: 'content',
        _attrs: {
          type: 'html',
        },
        _content: `<![CDATA[${imgEmbed} ${post.html}]]>`,
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
