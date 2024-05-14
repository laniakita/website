import type { StaticImport } from 'next/dist/shared/lib/get-img-props';
import type { PostTeaserObjectProps } from '@/utils/mdx-utils';
import { ClientBg } from './client-hero';

export async function HeroWrapper({ dataObject }: { dataObject: PostTeaserObjectProps }) {
  // I imagine there's likely race-conditions here, because I can't think of why else it seems 
  // impossible to use a relative path for the mdx image files. 
  // I recreated node.path.join and I still can't get it to import without webpack 
  // freaking out saying I need an image loader, when clearly it can import it just fine. 
  // And yet, even when I did use the loader, webpack decided those images weren't valid. 
  // So there's no winning it seems.
  /*
  const fileCleaner = (dirtyPath:string) => {
    let nestCount = 0;
    const split = dirtyPath.split('/').map((str:string) => {
      if (str === '.' ) {
        return undefined
      } else if (str === '..') {
        nestCount++
        return undefined
      }
      return str
    })
    const cleanedStr = split.join('/')
    return { cleanedStr, nestCount }
  }
  console.log(fileCleaner(dataObject.heroFile))
  const postsFolder = 'posts/published'
  const pathJoiner = (folderPath: string, dirtyPath: string) => {
    const cleanedObj = fileCleaner(dirtyPath) 
    const splitFolder = folderPath.split('/');
    const middlePath = splitFolder.slice(0, splitFolder.length - cleanedObj.nestCount).join('/')
    const finalPath = middlePath + cleanedObj.cleanedStr
    return finalPath
  }
  const imagePath = pathJoiner(postsFolder, dataObject.heroFile!)
  */
  const imageSource: StaticImport = (await import(/*webpackMode: "eager"*/ `@/app/blog/posts/assets/images/${dataObject.heroFile}`)) as StaticImport;
  return <ClientBg dataObject={dataObject} imageSource={JSON.parse(JSON.stringify(imageSource)) as StaticImport} />;
}
