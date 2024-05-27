#! /usr/bin/env bun
/* eslint-disable no-undef -- bun is bun */
/* eslint-disable no-console -- bun is bun */
import { parseArgs } from 'node:util';
import { toXML } from 'jstoxml';
import dayjs from 'dayjs';
import { BASE_URL } from '@/lib/constants';
import type { QueryPostMetaItem } from '@/lib/node-db-funcs';
import linker from '@/utils/linker';
import { queryPostMetasBun } from '@/lib/bun-db-funcs';

const packageDataRaw = Bun.file(`${process.cwd()}/package.json`);
const packageDataStr: unknown = await packageDataRaw.text();
const packageData: unknown = JSON.parse(packageDataStr as string);

interface Package {
  dependencies: {
    next: string;
  };
}

const blogPostRes = (await queryPostMetasBun()) as unknown as QueryPostMetaItem[];
const lastPostDateRFC822 = dayjs(blogPostRes[0]?.date).format('ddd, DD MMM YYYY HH:mm:ss ZZ');
const buildDateRFC822 = dayjs().format('ddd, DD MMM YYYY HH:mm:ss ZZ');
const nextjsVersion = (packageData as Package).dependencies.next; //split('^')[1];

const localUrl = 'http://localhost:3000';
const prodUrl = BASE_URL;

const { values } = parseArgs({
  args: Bun.argv,
  options: {
    production: {
      type: 'boolean',
      short: 'p',
    },
    development: {
      type: 'boolean',
      short: 'd',
    },
    //schemas: {
    //  type: "string",
    //},
  },
  strict: false,
  allowPositionals: true,
});

let buildUrl: string;
let urlMsg: string;

if (values.production) {
  buildUrl = prodUrl;
  urlMsg = 'for production';
} else if (values.development) {
  buildUrl = localUrl;
  urlMsg = 'for development';
} else {
  buildUrl = localUrl;
  urlMsg = 'for development';
}

const xmlOpts = {
  header: true,
  indent: '  ',
};

const resolveTags = (tagsArr: { id: string; slug: string; title: string }[]) => {
  const res = tagsArr.map((tagItem) => {
    const cat = {
      _name: 'category',
      _attrs: {
        domain: `${BASE_URL}/${linker(tagItem.id, tagItem.slug, 'blog/tags')}`,
      },
      _content: tagItem.title,
    };
    return cat;
  });
  return res;
};

const itemRes = blogPostRes.map((post) => {
  const tagsArr = resolveTags(post.tags);

  const res = [
    {
      title: post.headline,
    },
    {
      link: `${buildUrl}/${linker(post.id, post.slug, 'blog/posts')}`,
    },
    {
      description: post.subheadline,
    },
    {
      author: post.author,
    },
    tagsArr,
    {
      _name: 'guid',
      _attrs: {
        isPermaLink: 'false',
      },
      _content: `${buildUrl}/${linker(post.id, post.slug, 'blog/posts')}`,
    },
    {
      pubDate: dayjs(post.date).format('ddd, DD MMM YYYY HH:mm:ss ZZ'),
    },
  ];
  return { item: res };
});

const rssFeed = {
  _name: 'rss',
  _attrs: {
    version: '2.0',
  },
  _content: {
    channel: [
      {
        title: `Yet Another Dev Blog, by Lani Akita`,
      },
      {
        description: 'A blog (mostly) about the process of developing (web-based) software.',
      },
      {
        link: `${buildUrl}/blog`,
      },
      { language: 'en-us' },
      {
        copyright: `Copyright ${new Date().getFullYear() === 2024 ? '2024' : `2024-${new Date().getFullYear()}`}, Lani Akita`,
      },
      {
        managingEditor: 'lani@laniakita.com',
      },
      {
        webMaster: 'lani@laniakita.com',
      },
      {
        pubDate: lastPostDateRFC822,
      },
      {
        lastBuildDate: buildDateRFC822,
      },
      {
        category: 'Technology',
      },
      {
        generator: `Next.js v${nextjsVersion}`,
      },
      {
        docs: 'https://www.rssboard.org/rss-specification',
      },
      // todo: cloud pubsubhub
      {
        ttl: 120,
      },
      itemRes,
    ],
  },
};

const rssGen = async (): Promise<void> => {
  try {
    const feedXml = toXML(rssFeed, xmlOpts);
    const xmlWritePath = `${process.cwd()}/public/dist/rss.xml`;
    await Bun.write(xmlWritePath, feedXml);
    console.log('wrote rss.xml to ', xmlWritePath, ' ', urlMsg);
  } catch (err) {
    console.error(err)
  }
};

export default rssGen
