import { writeWithHtmlContent } from './content-collections-plus-html';

const runScripts = async (): Promise<void> => {
  try {
    await writeWithHtmlContent();
  } catch (err) {
    console.error(err);
  }
};

try {
  await runScripts();
} catch (err) {
  console.error(err);
}
