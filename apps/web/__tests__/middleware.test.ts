import { NextRequest, type NextResponse } from 'next/server';
import { describe, expect, test, mock, afterEach  } from 'bun:test';
import middleware, { ofacCountries } from '@/middleware';

afterEach(() => {
  mockMiddleware.mockClear()
})

const mockRequest = mock((x: URL | RequestInfo) => new NextRequest(x));
const mockMiddleware = mock(middleware);

const host = 'https://laniakita.com';
const endpoint = new URL('/opengraph/static/about', host);
const allowedHeaders = new Headers({ 'CloudFront-Viewer-Country': 'US' });
const allowedRequest = new Request(endpoint, { headers: allowedHeaders });

describe('Geofencing on endpoints', () => {
  
  test('Requests from OFAC sanctioned countries return Http status 451', () => {
    const unavailableRequests = ofacCountries.map((country) => {
      const prohibitedHeaders = new Headers({ 'CloudFront-Viewer-Country': country });

      return new Request(endpoint, { headers: prohibitedHeaders });
    });

    unavailableRequests.forEach((req) => {
      mockMiddleware(mockRequest(req));
    });

    expect(mockMiddleware.mock.calls).toHaveLength(ofacCountries.length);
    expect(mockMiddleware.mock.results).toHaveLength(ofacCountries.length);
    mockMiddleware.mock.results.forEach((res) => {
      expect((res.value as NextResponse).status).toBe(451);
    });
  });

  test('Requests from non-OFAC sanctioned countries return Http status 200', () => {
    expect(mockMiddleware(mockRequest(allowedRequest)).status).toBe(200);
  });

});


describe('Endpoints are rate limited', () => {
  test('More than 10 Requests per minute return Http status 429', () => {
    const arr = new Array(20).fill(allowedRequest);

    arr.forEach((req: Request) => {
      mockMiddleware(mockRequest(req));
    });

    expect(mockMiddleware.mock.calls.length).toBe(20);
    expect(mockMiddleware.mock.results.length).toBe(20);

    mockMiddleware.mock.results.slice(0, 9).forEach((res) => {
      expect((res.value as NextResponse).status).toBe(200);
    });

    mockMiddleware.mock.results.slice(9, 20).forEach((res) => {
      expect((res.value as NextResponse).status).toBe(429);
    });
  });
});

