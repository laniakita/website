import { defineDocumentType, makeSource } from 'contentlayer2/source-files';
import { imageProcessor, FeaturedImageR1 } from './src/lib/image-process';

const CONTENT_DIR = 'content';

export const Project = defineDocumentType(() => ({
  name: 'Project',
  filePathPattern: 'projects/**/*.yaml',
  contentType: 'data',
  fields: {
    id: { type: 'string', required: true },
    date: { type: 'date', required: true },
    updated: { type: 'date', required: false },
    title: { type: 'string', required: true },
    tech: {
      type: 'list',
      of: { type: 'string' },
    },
    imageSrc: { type: 'string', required: false },
    altText: { type: 'string', required: false },
    caption: { type: 'string', required: false },
    description: { type: 'string', required: true },
    blogPost: { type: 'string', required: false },
    link: { type: 'string', required: false },
  },
  computedFields: {
    url: {
      type: 'string',
      resolve: (project) => `/${project._raw.flattenedPath}`,
    },
    featured_image: {
      type: 'json',
      resolve: async (project): Promise<FeaturedImageR1> => {
        if (!project.imageSrc) return new FeaturedImageR1(false, '', '', 0, 0, '', '', '', null);
        const data = await imageProcessor({
          contentDir: CONTENT_DIR,
          prefix: `${CONTENT_DIR}/${project._raw.flattenedPath}`,
          imgPath: project.imageSrc as string,
          debug: false,
        });

        const res = new FeaturedImageR1(
          true,
          data.src,
          data.base64,
          data.height,
          data.width,
          data.resized,
          (project.altText as string | undefined) ?? '',
          (project.caption as string | undefined) ?? '',
          data._debug ?? null,
        );

        return res;
      },
    },
  },
}));

export default makeSource({
  contentDirPath: CONTENT_DIR,
  documentTypes: [Project],
});
