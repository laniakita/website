#! /usr/bin/env bun
/* eslint-disable no-undef -- bun is bun */
/* eslint-disable no-console -- bun is bun */
import { parseArgs } from 'node:util';
import { toXML } from 'jstoxml';
import dayjs from 'dayjs';
import { batchMatterFetchBun } from '@/utils/bun-mdx-utils';
import type { PostTeaserObjectProps } from '@/utils/mdx-utils';
import { BASE_URL } from '@/lib/constants';

const packageDataRaw = Bun.file(`${process.cwd()}/package.json`);
const packageDataStr: unknown = await packageDataRaw.text();
const packageData: unknown = JSON.parse(packageDataStr as string);

interface Package {
  dependencies: {
    next: string;
  };
}

const blogPostRaw = await batchMatterFetchBun('./src/app/blog/posts/published');
const blogPostRes = blogPostRaw as PostTeaserObjectProps[];
const lastPostDateRFC822 = dayjs(blogPostRes[0]?.date).format('ddd, DD MMM YYYY HH:mm:ss ZZ');
const buildDateRFC822 = dayjs().format('ddd, DD MMM YYYY HH:mm:ss ZZ');
const nextjsVersion = (packageData as Package).dependencies.next.split('^')[1];

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

const itemRes = blogPostRes.map((post) => {
  const res = [
    {
      title: post.headline,
    },
    {
      link: `${buildUrl}/blog/${post.slug}`,
    },
    {
      description: post.subheadline,
    },
    {
      author: post.authorName,
    },
    {
      category: post['category-slug'],
    },
    {
      _name: 'guid',
      _attrs: {
        isPermaLink: 'false',
      },
      _content: `${buildUrl}/blog/${post.slug}`,
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

const feedXml = toXML(rssFeed, xmlOpts);

const xmlWritePath = `${process.cwd()}/public/dist/rss.xml`;

await Bun.write(xmlWritePath, feedXml);
console.log('wrote rss.xml to ', xmlWritePath, ' ', urlMsg);
