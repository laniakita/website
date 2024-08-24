export async function GET() {
  return new Response(`XML CONTENT`, {
    headers: {
      'Content-Type': 'text/xml',
    },
  });
}
