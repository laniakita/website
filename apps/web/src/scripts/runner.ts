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
  } catch (err) {
    console.error(err);
  }
};

try {
  await runScripts();
} catch (err) {
  console.error(err);
}
