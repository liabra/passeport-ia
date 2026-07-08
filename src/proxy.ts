import { NextRequest, NextResponse } from "next/server";

/**
 * Nonce-based Content-Security-Policy.
 *
 * Generated per request so the CSP can stay strict (`script-src 'self'
 * 'nonce-...' 'strict-dynamic'`) while still allowing Next.js' own scripts.
 * Next automatically stamps the nonce onto the scripts it emits when it finds
 * the CSP on the incoming request headers.
 *
 * Only `self` (plus Google Fonts) is allowed. Styles use `'unsafe-inline'`
 * because Tailwind / Next inject a small amount of inline styling and no
 * nonce mechanism exists for `style="..."` attributes; scripts remain locked.
 */
export function proxy(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const isDev = process.env.NODE_ENV !== "production";

  const csp = [
    `default-src 'self'`,
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${isDev ? " 'unsafe-eval'" : ""}`,
    `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com`,
    `font-src 'self' https://fonts.gstatic.com`,
    `img-src 'self' data: blob:`,
    `connect-src 'self'`,
    `worker-src 'self'`,
    `manifest-src 'self'`,
    `object-src 'none'`,
    `base-uri 'self'`,
    `form-action 'self'`,
    `frame-ancestors 'none'`,
    `upgrade-insecure-requests`,
  ]
    .join("; ")
    .concat(";");

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", csp);

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set("Content-Security-Policy", csp);
  return response;
}

export const config = {
  // Run on every path except static asset internals; the service worker and
  // manifest still need the header, so they are intentionally not excluded.
  matcher: [
    {
      source: "/((?!_next/static|_next/image|favicon.ico).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};
