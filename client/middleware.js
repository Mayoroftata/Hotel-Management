import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const PUBLIC_FILE = /\.(.*)$/;

export function middleware(req) {
  const url = req.nextUrl.clone();

  // Don't block static files
  if (PUBLIC_FILE.test(url.pathname)) return;

  // Only apply to /admin routes
  if (url.pathname.startsWith('/admin')) {
    const token = req.cookies.get('token')?.value;

    if (!token) {
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (decoded.role !== 'admin') {
        url.pathname = '/unauthorized'; // you can create this page
        return NextResponse.redirect(url);
      }
    } catch (err) {
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
