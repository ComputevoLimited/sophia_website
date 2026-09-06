/**
 * Cloudflare Worker — SOPHIA
 * Serves static assets with security headers.
 */

export default {
  async fetch(request, env) {
    const response = await env.ASSETS.fetch(request);
    return addSecurityHeaders(request, response);
  },
};

function addSecurityHeaders(request, response) {
  const h = new Headers(response.headers);
  const path = new URL(request.url).pathname;

  // Cache-Control: no-cache for HTML, long TTL for versioned assets
  if (path === '/' || path.endsWith('.html')) {
    h.set('Cache-Control', 'no-cache, no-store, must-revalidate');
  } else {
    h.set('Cache-Control', 'public, max-age=31536000, immutable');
  }

  h.set('X-Frame-Options',             'SAMEORIGIN');
  h.set('X-Content-Type-Options',      'nosniff');
  h.set('Referrer-Policy',             'strict-origin-when-cross-origin');
  h.set('Permissions-Policy',          'geolocation=(), microphone=(), camera=(), payment=(), usb=()');
  h.set('Strict-Transport-Security',   'max-age=31536000; includeSubDomains; preload');
  h.set('Cross-Origin-Opener-Policy',        'same-origin');
  h.set('Cross-Origin-Resource-Policy',      'same-origin');
  h.set('X-Permitted-Cross-Domain-Policies', 'none');
  h.set('Content-Security-Policy',
    "default-src 'self'; " +
    "script-src 'self'; " +
    "style-src 'self' https://fonts.googleapis.com; " +
    "font-src 'self' https://fonts.gstatic.com; " +
    "img-src 'self'; " +
    "frame-src 'none'; " +
    "frame-ancestors 'self'; " +
    "connect-src 'self'; " +
    "object-src 'none'; " +
    "base-uri 'self'; " +
    "form-action 'none'; " +
    "upgrade-insecure-requests;"
  );
  return new Response(response.body, {
    status:     response.status,
    statusText: response.statusText,
    headers:    h,
  });
}
