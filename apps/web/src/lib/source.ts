import { loader } from "fumadocs-core/source";
import { createMDXSource } from "fumadocs-mdx";
import { post } from 'source';
import { FeaturedImageR1, imageProcessor } from "./image-process";

/*
const debugSchema = z.object({
  destination: z.string(),
  status: z.object({
    exists: z.boolean(),
    existsInPublic: z.boolean()
  }),
  didCopy: z.string(),
  reason: z.string()

})

const featuredImageSchema = z.object({
  hasImage: z.boolean(),
  src: z.string(),
  base64: z.string(),
  height: z.number(),
  width: z.number(),
  resized: z.string(),
  altText: z.string(),
  caption: z.string(),
  debug: debugSchema.or(z.null())
})
*/

const featuredImgRes = async (imageSrc: string, altText: string, caption: string, collection: string, path: string) => {
  const imgData = await imageProcessor({
    contentDir: 'content',
    prefix: `content/${collection}/${path}`,
    imgPath: imageSrc,
    debug: false,
  })

  const res = imgData ? new FeaturedImageR1(
    true,
    imgData.src,
    imgData.base64,
    imgData.height,
    imgData.width,
    imgData.resized,
    altText ?? '',
    caption ?? '',
    imgData._debug ?? null,
  ) : new FeaturedImageR1(false, '', '', 0, 0, '', '', '', null);

  return res

}
export const blogPosts = loader({
  baseUrl: '/posts/',
  source: createMDXSource(post),
  transformers: [
    ({ storage }) => {


      storage.files.forEach(async (file) => {
        const _data = 'data' in file.data && file.data.data;


        if ('data' in file.data && 'data' in file.data.data && _data && 'imageSrc' in _data && 'altText' in _data && 'caption' in _data && 'featured_image' in _data) {
          const image = await featuredImgRes(_data.imageSrc as string, _data.altText as string, _data.caption as string, 'blog', file.file.path)

          //const newFile = {...file,  data: {...file.data, data: {...file.data.data, image} }}
          // @ts-expect-error -- tyopes
          storage.write(file.file.path, file.format, { ...file.data, data: { ...file.data.data, featured_image: image }})
        }

      });
      

    }

  ],
  pageTree: {
    attachFile(node, file) {
      // you can access its file information
      console.log(file?.data);

      return node;
    },
  },
  /*
  pageTree: {
     attachFile(node, file) {
      //console.log(file?.data);

      if (file && 'imageSrc' in file.data && 'altText' in file.data && 'caption' in file.data) {
        const image = await featuredImgRes(file.data.imageSrc as string, file.data.altText as string, file.data.caption as string, 'blog', file.file.path)
        console.log(image);
      }

      return node;
    }
  }*/
});


