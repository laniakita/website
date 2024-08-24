import packageVersionSaver from 'package-version-saver'
// opts
const buildDate = new Date().toISOString();
const xmlOpts = {
  header: true,
  indent: '  ',
};

// data

export async function GET() {
  return new Response(`XML CONTENT`, {
    headers: {
      'Content-Type': 'text/xml',
    },
  });
}
