import type { NextConfig } from "next";

/**
 * Baseline security headers. Applied to every route.
 *
 * - HSTS: force browsers to only speak HTTPS for 2 years, including subdomains.
 *   preload opts us into the browser HSTS preload list (submit separately).
 * - X-Frame-Options DENY: nobody iframes skillies.ai anywhere. Stops clickjacking,
 *   and stops scam sites from wrapping us in their chrome to harvest payments.
 * - X-Content-Type-Options nosniff: browsers don't guess MIME types.
 * - Referrer-Policy: send origin only to cross-site navigations, full referrer
 *   within our own domain. Don't leak query strings to third-party analytics.
 * - Permissions-Policy: kill browser APIs we don't use (camera, geo, USB,
 *   etc.) so a supply-chain attack on a dependency can't silently ask for
 *   them. Microphone is `(self)` — required by the on-page ElevenLabs voice
 *   widget; no third-party origin gets it. Payment is `(self)` for Razorpay.
 * - X-DNS-Prefetch-Control on: tiny perf win.
 *
 * Deliberately NOT adding a strict CSP right now — our inline-style-heavy
 * design system (every component uses style={{...}}) would need 'unsafe-inline'
 * which defeats the point. Worth revisiting when we move to CSS modules /
 * design tokens.
 */
const SECURITY_HEADERS = [
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value:
      "camera=(), microphone=(self), geolocation=(), interest-cohort=(), payment=(self), usb=(), magnetometer=(), gyroscope=(), accelerometer=()",
  },
  { key: "X-DNS-Prefetch-Control", value: "on" },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: SECURITY_HEADERS,
      },
    ];
  },
  /**
   * Post-pivot redirect map. The old consumer routes (/workshop /program
   * /mentorship /courses /learn /consultation /services) were deleted in
   * the B2B pivot 2026-05-03. Anyone arriving on those URLs lands on the
   * combined Skillies School page (KDP methodology) or /pricing for
   * appointment booking.
   *
   * /dashboard is intentionally NOT redirected · it still exists for
   * authenticated users.
   */
  async redirects() {
    return [
      { source: "/consultation", destination: "/pricing", permanent: true },
      { source: "/consultation/:path*", destination: "/pricing", permanent: true },
      { source: "/workshop", destination: "/skillies-school", permanent: true },
      { source: "/workshop/:path*", destination: "/skillies-school", permanent: true },
      { source: "/program", destination: "/skillies-school", permanent: true },
      { source: "/program/:path*", destination: "/skillies-school", permanent: true },
      { source: "/mentorship", destination: "/skillies-school", permanent: true },
      { source: "/mentorship/:path*", destination: "/skillies-school", permanent: true },
      { source: "/courses", destination: "/skillies-school", permanent: true },
      { source: "/courses/:path*", destination: "/skillies-school", permanent: true },
      { source: "/learn", destination: "/skillies-school", permanent: true },
      { source: "/learn/:path*", destination: "/skillies-school", permanent: true },
      { source: "/services", destination: "/for", permanent: true },
      { source: "/services/:path*", destination: "/for", permanent: true },
    ];
  },
};

export default nextConfig;
