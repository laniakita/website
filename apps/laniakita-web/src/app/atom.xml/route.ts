import packageVersionSaver from 'package-version-saver'

// opts
const buildDate = new Date().toISOString();
const xmlOpts = {
  header: true,
  indent: '  ',
};

// data
const NEXTJS_VERSION = packageVersionSaver.versions.dependencies.next as string;
console.log(NEXTJS_VERSION);

export async function GET() {
  return new Response(`XML CONTENT`, {
    headers: {
      'Content-Type': 'text/xml',
    },
  });
}
