import type { ReactNode } from 'react';
import Footer from '@/components/footer/footer';
import Navbar from '@/components/navbar';
import ToCMenuCore, { ToCMenuMobileCore } from '@/components/table-of-contents/core';
import { allPosts } from 'content-collections';
import { JSDOM } from 'jsdom';

interface HeadingNode {
  id: string;
  level: number;
  title: string;
  children: HeadingNode[];
}

type FlatHeadingNode = {
  id: string;
  title: string;
};

export default async function PostPageLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;

  const post = allPosts.find((postX) => slug.some((sl) => postX.url.split('/').pop() === sl));

  const PostMdx = post && await import(`@content/posts/${post._meta.path}.mdx`)
  

  //const postHtml = post && await render(post._meta.path);

  const doc = new JSDOM(`<!DOCTYPE html></html>`);
  const headings = Array.from(doc.window.document.querySelectorAll('h2, h3, h4, h5, h6')).filter(
    (el) => el.id.length > 0,
  ) as HTMLHeadingElement[];

  const getNestedHeadings = (headings: HTMLHeadingElement[], level: number): HeadingNode[] => {
    const nestedTree: HeadingNode[] = [];
    let currNode: HeadingNode = {
      id: '',
      level: 0,
      title: '',
      children: [],
    };

    while (headings.length > 0) {
      const currHeading = headings[0]!;
      const headingLevel = parseInt(currHeading.nodeName[1]!);
      if (headingLevel === level) {
        currNode = {
          id: currHeading.id ?? '',
          level: parseInt(currHeading.nodeName[1]!),
          title: currHeading.innerHTML ?? '',
          children: [],
        };
        nestedTree.push(currNode);
        headings.shift();
      } else if (headingLevel > level) {
        if (currNode) {
          currNode.children = getNestedHeadings(headings, headingLevel);
        }
      } else {
        break;
      }
    }
    return nestedTree;
  };

  const getFlatHeadings = (headings: HTMLHeadingElement[]): FlatHeadingNode[] => {
    const headingsArr = [];

    for (const heading of headings) {
      const node = {
        id: heading.id ?? '',
        title: heading.innerHTML ?? '',
      };
      headingsArr.push(node);
    }
    return headingsArr;
  };

  const nestedHeadings = getNestedHeadings(Array.from(headings), 2);
  const flatHeadings = getFlatHeadings(headings);

  return (
    <div className='flex size-full flex-col md:relative md:flex-row'>
      <ToCMenuCore flatHeadings={JSON.stringify(flatHeadings)} nestedHeadings={JSON.stringify(nestedHeadings)} />

      <div className='size-full min-w-0'>
        <Navbar />
        <ToCMenuMobileCore
          flatHeadings={JSON.stringify(flatHeadings)}
          nestedHeadings={JSON.stringify(nestedHeadings)}
        />
        <div className='flex max-w-7xl flex-col md:m-auto md:min-w-0'>
          {children}
          <Footer
            override
            outsidePadding='px-0 md:px-6 pb-10 lg:pb-common'
            insidePadding='p-6 md:p-0 lg:p-10'
            iconContainerPadding='px-4 md:px-0'
            linksContainerPadding='p-4 md:px-0'
          />
        </div>
      </div>
    </div>
  );
}
