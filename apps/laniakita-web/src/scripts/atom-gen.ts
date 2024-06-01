#! /usr/bin/env bun
/* eslint-disable no-undef -- bun is bun */
/* eslint-disable no-console -- bun is bun */
import { toXML } from 'jstoxml';
import { desc } from 'drizzle-orm';
import { BASE_URL } from '@/lib/constants';
import type { QueryPostMetaItem } from '@/lib/node-db-funcs';
import linker from '@/utils/linker';
import { maindb } from '@/lib/db/turso-db';
import { posts } from '@/lib/db/schema/posts';
import { resMdxV3 } from '@/utils/mdxbundler-main';
import { mdxStr } from '@/app/blog/mdx-helper';

const packageDataRaw = Bun.file(`${process.cwd()}/package.json`);
const packageDataStr: unknown = await packageDataRaw.text();
const packageData: unknown = JSON.parse(packageDataStr as string);

interface Package {
  dependencies: {
    next: string;
  };
}

const queryPosts = async () => {
  const postRes = await maindb.query.posts.findMany({
    orderBy: [desc(posts.date)],
    columns: {
      authorId: false,
      featuredImageId: false,
    },
    with: {
      author: {
        columns: {
          name: true,
        },
      },
      postToTags: {
        columns: {
          tagId: false,
          postId: false,
        },
        with: {
          tag: {
            columns: {
              slug: true,
              title: true,
              id: true,
            },
          },
        },
      },
      featuredImage: {
        columns: {
          fileLocation: true,
          altText: true,
          caption: true,
          credit: true,
        },
      },
    },
  });
  const finalRes = postRes.map((post) => {
    const tagsOne = post.postToTags.map((tagsObj) => {
      const slug = tagsObj.tag.slug;
      const title = tagsObj.tag.title;
      const id = tagsObj.tag.id;

      return { slug, title, id };
    });
    delete (post as unknown as { postToTags: Record<string, unknown> | undefined }).postToTags;
    return { ...post, tags: tagsOne };
  });
  return finalRes;
};

interface QueryPostsProps extends Omit<QueryPostMetaItem, 'featuredImage'> {
  rawStr: string;
  altCaption: string;
  featuredImage?: {
    fileLocation: string;
    altText: string;
    caption: string;
    credit?: string;
    blur: null | undefined;
    height: null | undefined;
    width: null | undefined;
  };
}

const blogPostRes = (await queryPosts()) as unknown as QueryPostsProps[];

/*
const lastPostDateRFC822 = dayjs(blogPostRes[0]?.date).format('ddd, DD MMM YYYY HH:mm:ss ZZ');
const buildDateRFC822 = dayjs().format('ddd, DD MMM YYYY HH:mm:ss ZZ');
*/

const nextjsVersion = (packageData as Package).dependencies.next; //split('^')[1];

const buildDate = new Date().toISOString();

const xmlOpts = {
  header: true,
  indent: '  ',
};

const resolveTags = (tagsArr: { id: string; slug: string; title: string }[]) => {
  const res = tagsArr.map((tagItem) => {
    const cat = {
      _name: 'category',
      _attrs: [
        {
          term: tagItem.title,
        },
        {
          scheme: `${BASE_URL}/${linker(tagItem.id, tagItem.slug, 'blog/tags')}`,
        },
      ],
    };
    return cat;
  });
  return res;
};

const entryRes = await Promise.all(
  blogPostRes.map(async (post) => {
    const tagsArr = resolveTags(post.tags);
    const imgEmbed = post.featuredImage?.fileLocation
      ? `
    <figure>
      <img src="${BASE_URL}${post.featuredImage.fileLocation}" alt="${post.featuredImage.altText}" />
      <figcaption>${post.altCaption ? post.altCaption : post.featuredImage.caption}${(post.featuredImage.credit as unknown) !== null ? `Image By, ${post.featuredImage.credit}` : ''}</figcaption>
    </figure>`
      : '';

    const cwdFolderStrPre = post.localKey.split('/');
    const cwdFolderStr = cwdFolderStrPre.slice(0, cwdFolderStrPre.length - 1).join('/');
    const rawMDX = post.rawStr;
    const postId = post.id.split('-').shift();
    if (!postId) return;
    if (!rawMDX) return;
    if (!cwdFolderStr) return;
    const resMdx = await resMdxV3(rawMDX, cwdFolderStr, postId, 'blog');
    const mdx = mdxStr(resMdx.code);
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
            href: `${BASE_URL}/${linker(post.id, post.slug, 'blog/posts')}`,
          },
        ],
      },
      {
        id: `${BASE_URL}/${linker(post.id, post.slug, 'blog/posts')}`,
      },
      {
        updated: new Date(post.date.toString()).toISOString(),
      },
      tagsArr,
      {
        _name: 'content',
        _attrs: {
          type: 'html',
        },
        _content: `<![CDATA[${imgEmbed + mdx}]]>`,
      },
    ];
    return { entry: res };
  }),
);

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
      _attrs: {
        href: `${BASE_URL}/`,
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
          uri: `${BASE_URL}/about`,
        },
      ],
    },
    {
      _name: 'link',
      _attrs: [
        {
          rel: 'self',
        },
        {
          href: `${BASE_URL}/feed.xml`,
        },
      ],
    },
    {
      _name: 'link',
      _attrs: [
        {
          rel: 'alternate',
        },
        {
          href: `${BASE_URL}/blog`,
        },
      ],
    },
    {
      category: 'Technology',
    },
    {
      _name: 'generator',
      _attrs: {
        version: nextjsVersion,
      },
      _content: 'Next.js',
    },
    {
      icon: `${BASE_URL}/favicon.ico`,
    },
    {
      logo: `${BASE_URL}/icon1.svg`,
    },
    {
      rights: `Copyright © ${new Date().getFullYear() === 2024 ? '2024' : `2024-${new Date().getFullYear()}`}, Lani Akita`,
    },
    {
      subtitle: 'A blog (mostly) about the process of developing (web-based) software.',
    },
    {
      id: `${BASE_URL}/`,
    },
    entryRes,
  ],
};

const atomGen = async (): Promise<void> => {
  try {
    const feedXml = toXML(atomFeed, xmlOpts);
    const xmlWritePath = `${process.cwd()}/public/feed.xml`;
    await Bun.write(xmlWritePath, feedXml);
    console.log('wrote feed.xml to', xmlWritePath);
  } catch (err) {
    console.error(err);
  }
};

export default atomGen;
