import { type NextRequest, NextResponse } from 'next/server';

// rate limit
const ALLOWED_REQUESTS = 10;
const TIME_FRAME = 15 * 60 * 1000;

const requestRecords: Record<string, number[]> = {};

export default function middleware(request: NextRequest) {
  const ip = (request.ip ?? request.headers.get("CloudFront-Viewer-Address"))!
  const currentTimestamp = Date.now();
  
  if (!requestRecords[ip]) {
    requestRecords[ip] = [];
  }
  
  // get timestamps only for the last 15 minutes.
  requestRecords[ip] = requestRecords[ip].filter(
    (ts) => currentTimestamp - ts < TIME_FRAME
  );
  
  if (requestRecords[ip].length >= ALLOWED_REQUESTS) {
    return new Response("Rate limit exceeded.", { status: 429 })
  }

  requestRecords[ip].push(currentTimestamp);
  return NextResponse.next();
  
}
