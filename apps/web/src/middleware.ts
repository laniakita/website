import { type NextRequest, NextResponse } from 'next/server';
import { SlidingWindowCounterRateLimiter } from './lib/rate-limiter';

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    {
      source:
        '/((?!_next/static|_next/image|favicon.ico|icon1.svg|icon2.png|icon3.png|apple-icon1.png|apple-icon2.png|apple-icon3.png|sitemap.xml|robots.txt|manifest.json).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
  ],
};

/*
 * The U.S. Department of State prohibits the export of
 * military/space equipment or technical data to these
 * countries and to foreign nationals of these countries.^1
 *
 * 1 - Countries Subject to Prohibition on Military Exports.
 * https://orpa.princeton.edu/export-controls/sanctioned-countries.
 */
const ofacCountries = [
  'AF',
  'BY',
  'MM',
  'CF',
  'CN',
  'CU',
  'CG',
  'CY',
  'ER',
  'ET',
  'HT',
  'IR',
  'IQ',
  'LB',
  'LY',
  'NI',
  'KP',
  'RU',
  'SO',
  'SS',
  'SY',
  'VE',
  'ZW',
];

const limiter = new SlidingWindowCounterRateLimiter(150, 1000*60);

export default function middleware(request: NextRequest) {
  const visitorCountryCode = request.geo?.country;
  if (visitorCountryCode) {
    if (ofacCountries.find((country) => country === visitorCountryCode)) {
      return new Response('Resource is unavailable.', { status: 451 });
    }
  }

  const ip = (request.ip ??
    request.headers.get('CloudFront-Viewer-Address') ??
    request.headers.get('X-Forwarded-For'))!;
  const fingerprint = request.headers.get('CloudFront-Viewer-JA3-Fingerprint');

  const requester = fingerprint ?? ip;

  if (limiter.allowed(requester)) {
    return NextResponse.next();
  }

  return new Response('Too many requests', { status: 429 });
}
