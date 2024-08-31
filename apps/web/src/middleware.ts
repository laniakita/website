import { type NextRequest, NextResponse } from 'next/server';

export const config = {
  matcher: [
    {
      source: '/assets/(.*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
    {
      source: '/opengraph/(.*)',
      has: [{ type: 'header', key: 'x-present' }],
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch'}
      ],
    },
  ],
};

// rate limit
const ALLOWED_REQUESTS = 100;
const TIME_FRAME = 15 * 60 * 1000;

const requestRecords: Record<string, number[]> = {};

export default function middleware(request: NextRequest) {
  const ip = (request.ip ?? request.headers.get('CloudFront-Viewer-Address') ?? request.headers.get('X-Forwarded-For'))!;
  const fingerprint = request.headers.get('CloudFront-Viewer-JA3-Fingerprint');
  
  const requester = fingerprint ?? ip
  

  const currentTimestamp = Date.now();

  if (!requestRecords[requester]) {
    requestRecords[requester] = [];
  }

  // get timestamps only for the last 15 minutes.
  requestRecords[requester] = requestRecords[requester].filter((ts) => currentTimestamp - ts < TIME_FRAME);

  if (requestRecords[requester].length >= ALLOWED_REQUESTS) {
    return new Response('Too many requests.', { status: 429 });
  }

  requestRecords[requester].push(currentTimestamp);
  return NextResponse.next();
}
