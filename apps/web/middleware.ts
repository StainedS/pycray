import { type NextMiddleware, NextResponse } from 'next/server';

export const config = {
  matcher: ['/((?!_next/static|_next/image|ingest|favicon.ico).*)'],
};

const middleware: NextMiddleware = async (request) => {
  // Basic middleware that just continues the request
  return NextResponse.next();
};

export default middleware;
