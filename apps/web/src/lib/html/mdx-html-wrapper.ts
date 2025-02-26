import { Post } from 'content-collections';
import jsxToHtml from './mdx-html';
import path from 'node:path';

export const postHtml = async (post: Post) => {
  const folderPath = path.join(process.cwd(), 'content/posts', post._meta.directory);
  const renderedMdx = await jsxToHtml(post.content, 'content', folderPath);
  return renderedMdx;
};
