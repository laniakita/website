import { ConfigSchema, SourcePreprocessor } from './preprocess';
import { syncVersionVault } from './version-vault';

const runScripts = async (): Promise<void> => {
  try {
    const laniVersionVaultConfig = {
      packages: {
        dependencies: ['next'],
      },
    };
    await syncVersionVault(laniVersionVaultConfig);
    console.log('trying to build theme-getter');
    await Bun.build({
      entrypoints: ['./src/lib/theme-getter.ts'],
      outdir: './public/dist',
    });
    console.log('theme-getter.js built successfully!');
    const config = [
      {
        schema: 'blog',
        type: 'doc',
        dir: 'content/posts',
      },
      {
        schema: 'projects',
        type: 'doc',
        dir: 'content/projects',
      },
      {
        schema: 'works',
        type: 'doc',
        dir: 'content/works',
      },
    ] satisfies ConfigSchema[];

    await SourcePreprocessor(config);
  } catch (err) {
    console.error(err);
  }
};

try {
  await runScripts();
} catch (err) {
  console.error(err);
}
