import { type NextRequest, NextResponse } from 'next/server';
import { SlidingWindowCounterRateLimiter } from './lib/rate-limiter';

export const config = {
  matcher: ['/opengraph/:path*'],
};

/*
 * The U.S. Department of State prohibits the export of
 * military/space equipment or technical data to these
 * countries and to foreign nationals of these countries.^1
 *
 * 1 - Countries Subject to Prohibition on Military Exports.
 * https://orpa.princeton.edu/export-controls/sanctioned-countries.
 */
export const ofacCountries = [
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

const limiter = new SlidingWindowCounterRateLimiter(10, 1000 * 60);

export default function middleware(request: NextRequest) {
  const visitorCountryCode = request.headers.get('CloudFront-Viewer-Country') ?? request.geo?.country;
  if (visitorCountryCode) {
    if (ofacCountries.find((country) => country === visitorCountryCode)) {
      return new Response('Resource is unavailable.', { status: 451 });
    }
  }
  const ip = (request.headers.get('CloudFront-Viewer-Address') ??
    request.ip ??
    request.headers.get('X-Forwarded-For'))!;

  const fingerprint = request.headers.get('CloudFront-Viewer-JA3-Fingerprint');
  const requester = fingerprint ?? ip;

  if (limiter.allowed(requester)) {
    return NextResponse.next();
  }

  return new Response('Too many requests', { status: 429 });
}
