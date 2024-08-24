const buildDate = new Date().toISOString();
const xmlOpts = {
  header: true,
  indent: '  ',
};

export async function GET() {
  return new Response(`XML CONTENT`, {
    headers: {
      'Content-Type': 'text/xml',
    },
  });
}
