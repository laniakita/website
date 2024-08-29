import 'dotenv/config';
import { syncVersionVault } from './version-vault';

const runScripts = async (): Promise<void> => {
  try {
    const laniVersionVaultConfig = {
      packages: {
        dependencies: ['next'],
      },
    };
    await syncVersionVault(laniVersionVaultConfig);
  } catch (err) {
    console.error(err);
  }
};

try {
  await runScripts();
} catch (err) {
  console.error(err);
}
