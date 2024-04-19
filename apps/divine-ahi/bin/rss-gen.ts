#! /usr/bin/env bun
/* eslint-disable no-undef -- bun is bun */
/* eslint-disable no-console -- bun is bun */
import { parseArgs } from 'node:util';
import { toXML } from 'jstoxml';
import dayjs from 'dayjs';
import { queryPostMetas } from '@/lib/utils/mdxlite-utils-bun';

const packageDataRaw = Bun.file(`${process.cwd()}/package.json`)
const packageDataStr: unknown = await packageDataRaw.text()
const packageData: unknown = JSON.parse(packageDataStr as string)

interface Package {
  dependencies: {
    next: string 
  }
}

const blogPostRes = await queryPostMetas();
const lastPostDateRFC822 = dayjs(blogPostRes[0]?.date).format('ddd, DD MMM YYYY HH:mm:ss ZZ');
const buildDateRFC822 = dayjs().format('ddd, DD MMM YYYY HH:mm:ss ZZ');
const nextjsVersion = (packageData as Package).dependencies.next.split('^')[1];

const localUrl = 'http://localhost:3000'
const prodUrl = 'https://laniakita.com'

const { values } = parseArgs({
  args: Bun.argv,
  options: {
    production: {
      type: 'boolean',
      short: 'p'
    },
    development: {
      type: 'boolean',
      short: 'd'
    }
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
  buildUrl = prodUrl
  urlMsg = 'for production' 
} else if (values.development) {
  buildUrl = localUrl
  urlMsg = 'for development'
} else {
  buildUrl = localUrl
  urlMsg = 'for development'
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
      link: `${buildUrl}/blog/posts/${post.id.split('-')[0]}/${post.headline.replaceAll(' ', '_')}` 
    },
    { 
      description: post.subheadline 
    },
    {
      author: post.authorName 
    },
    {
      category: post.category 
    },
    {
      guid: post.id 
    },
    {
      pubDate: dayjs(post.date).format('ddd, DD MMM YYYY HH:mm:ss ZZ') 
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
        title: `Lani Akita's Web Dev Blog`,
      },
      {
        description:
          "Dive into the details of all the latest technologies Lani's learning, using, and forming opinions on, as she builds applications for the modern web.",
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

const feedXml = toXML(rssFeed, xmlOpts)

const xmlWritePath = `${process.cwd()}/public/rss.xml`
//console.log(xmlWritePath)

await Bun.write(xmlWritePath, feedXml)
console.log('wrote rss.xml to ', xmlWritePath, ' ', urlMsg)

