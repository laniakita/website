import { Post } from 'contentlayer/generated';
import jsxToHtml from './mdx-html';

export const postHtml = async (post: Post) => {
  const folderPath = post._raw.sourceFileDir;
  const renderedMdx = await jsxToHtml(post.body.raw, 'content', folderPath);
  return renderedMdx;
};
