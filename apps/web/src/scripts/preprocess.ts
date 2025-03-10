import { FeaturedImageR1, imageProcessor } from '@/lib/image-process';
import matter from 'gray-matter';
import { readdir, readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';

export type ConfigSchema = {
  schema: string;
  dir: string;
  type: 'doc' | 'meta';
};

type FileProps = {
  _file: InfoProps;
  data: Record<string, unknown>;
};

type InfoProps = {
  type: string;
  path: string;
  absolute_path: string;
  ext: string;
  dir: string;
  parent_dir: string;
  slug: string;
  source: string;
};

async function getFileData(dir: string, ext: string[]): Promise<InfoProps[]> {
  const contentDir = path.join(process.cwd(), dir);
  const filePaths = await readdir(contentDir, { recursive: true });

  const fileDataArray = await Promise.all(
    filePaths.map(async (filePath) => {
      if (ext.some((extension) => filePath.includes(extension))) {
        const absolute_path = path.join(contentDir, filePath) ?? '';
        const source = (await readFile(absolute_path, { encoding: 'utf-8' })) ?? '';

        return {
          type: 'doc',
          path: filePath,
          absolute_path,
          ext: filePath.split('/')?.pop()?.split('.')?.pop(),
          dir: filePath.split('/').slice(0, -1).join('/') ?? '',
          parent_dir: dir,
          slug: filePath.split('/')?.pop()?.split('.')?.shift(),
          source,
        };
      }
    }),
  ).then((arr) => arr.filter((el) => el) as InfoProps[]);
  return fileDataArray;
}

async function handleDoc(props: ConfigSchema, docExtensions: string[]) {
  const fileInfoArray = await getFileData(props.dir, docExtensions);

  const fileGen: FileProps[] = await Promise.all(
    fileInfoArray.map(async (file) => {
      const frontmatter = matter(file.source).data;
      const data = {};

      if ('imageSrc' in frontmatter) {
        const imgData = await imageProcessor({
          contentDir: 'content',
          prefix: `content/${props.schema}/${file.path}`,
          imgPath: frontmatter.imageSrc,
          debug: false,
        });

        const res = imgData
          ? new FeaturedImageR1(
              true,
              imgData.src,
              imgData.base64,
              imgData.height,
              imgData.width,
              imgData.resized,
              frontmatter.altText ?? '',
              'caption' in frontmatter ? frontmatter.caption : '',
              imgData._debug ?? null,
            )
          : new FeaturedImageR1(false, '', '', 0, 0, '', '', '', null);

        Object.assign(data, { featured_image: res });
      }

      return {
        _file: file,
        data,
      };
    }),
  );

  for await (const file of fileGen) {
    // write output
    try {
      //console.log(file)
      const outputDir = path.join(
        process.cwd(),
        'content/assets/data',
        file._file.parent_dir.split('content').join('/'),
        file._file.dir,
      );
      const outputPath = path.join(outputDir, `${file._file.slug}.json`);
      console.log(outputDir);

      await mkdir(outputDir, { recursive: true });
      console.log(`[success]: created ${outputDir}`);

      const fileData = JSON.stringify({ data: { ...file.data } });
      console.log(`[success]: wrote ${file._file.slug}.json to ${outputPath}`);
      await writeFile(outputPath, fileData);
    } catch (err) {
      console.error(err);
    }
  }

  return fileGen;
}

export async function SourcePreprocessor(props: ConfigSchema[]) {
  //const ext = props.type === 'doc' ? ['.mdx', '.md'] : ['.json', '.yml'];
  const docExtensions = ['.mdx', '.md'];
  //const metaExtensions = ['.json', '.yml'];

  for (const schema of props) {
    if (schema.type === 'doc') {
      handleDoc(schema, docExtensions);
    }
  }
}
