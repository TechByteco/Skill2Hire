import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Role-protected URL paths
const PROTECTED_ROUTES = [
  { prefix: '/student', allowedRole: 'student' },
  { prefix: '/college', allowedRole: 'college' },
  { prefix: '/recruiter', allowedRole: 'company' },
  { prefix: '/company', allowedRole: 'company' },
  { prefix: '/admin', allowedRole: 'admin' },
];

const JWT_SECRET = process.env.JWT_SECRET || '';

/**
 * Edge-compatible cryptographic HMAC-SHA256 JWT verification using Web Crypto API
 */
async function verifyEdgeSession(token: string): Promise<{ role: string; expiresAt: number } | null> {
  try {
    if (!JWT_SECRET) return null; // JWT_SECRET not configured — reject all tokens
    if (!token || typeof token !== 'string') return null;
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const [headerB64, payloadB64, signatureB64] = parts;

    // Import secret key for HMAC SHA-256
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(JWT_SECRET),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    );

    // Decode base64url signature
    let base64Sig = signatureB64.replace(/-/g, '+').replace(/_/g, '/');
    while (base64Sig.length % 4) base64Sig += '=';
    const binarySig = atob(base64Sig);
    const sigBytes = new Uint8Array(binarySig.length);
    for (let i = 0; i < binarySig.length; i++) {
      sigBytes[i] = binarySig.charCodeAt(i);
    }

    const dataBytes = encoder.encode(`${headerB64}.${payloadB64}`);
    const isValid = await crypto.subtle.verify('HMAC', key, sigBytes, dataBytes);

    if (!isValid) return null;

    // Decode and parse payload
    let base64Payload = payloadB64.replace(/-/g, '+').replace(/_/g, '/');
    while (base64Payload.length % 4) base64Payload += '=';
    const payload = JSON.parse(atob(base64Payload));

    const nowSec = Math.floor(Date.now() / 1000);
    if (payload.expiresAt && payload.expiresAt < nowSec) {
      return null;
    }
    return payload;
  } catch (e) {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Match protected page routes
  const matchedRoute = PROTECTED_ROUTES.find(r => pathname.startsWith(r.prefix));
  if (!matchedRoute) {
    return NextResponse.next();
  }

  // Retrieve session token from cookie or authorization header
  const sessionCookie = request.cookies.get('s2h_session')?.value;
  const authHeader = request.headers.get('authorization')?.replace('Bearer ', '');
  const token = sessionCookie || authHeader;

  // If unauthenticated or no session token
  if (!token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  const session = await verifyEdgeSession(token);
  if (!session) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Role verification guard: redirect cross-role access to user's authorized home dashboard
  if (session.role !== matchedRoute.allowedRole && session.role !== 'admin') {
    let redirectDashboard = '/student/dashboard';
    if (session.role === 'college') redirectDashboard = '/college/dashboard';
    if (session.role === 'company') redirectDashboard = '/recruiter/dashboard';
    if (session.role === 'admin') redirectDashboard = '/admin/dashboard';

    const safeRedirect = new URL(redirectDashboard, request.url);
    safeRedirect.searchParams.set('denied', 'true');
    return NextResponse.redirect(safeRedirect);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/student/:path*',
    '/college/:path*',
    '/recruiter/:path*',
    '/company/:path*',
    '/admin/:path*',
  ]
};
