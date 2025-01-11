import { syncVersionVault } from './version-vault';
import { writeMinifiedContent } from './contentlayer-minifier';
import { writeWithHtmlContent } from './contentlayer-plus-html';

const runScripts = async (): Promise<void> => {
  try {
    const laniVersionVaultConfig = {
      packages: {
        dependencies: ['next'],
      },
    };
    await syncVersionVault(laniVersionVaultConfig);
    await writeWithHtmlContent();
    await writeMinifiedContent();
  } catch (err) {
    console.error(err);
  }
};

try {
  await runScripts();
} catch (err) {
  console.error(err);
}
