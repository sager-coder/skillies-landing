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
 * - Permissions-Policy: kill browser APIs we don't use (camera, mic, geo, USB,
 *   payment, etc.) so a supply-chain attack on a dependency can't silently ask
 *   for them.
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
      "camera=(), microphone=(), geolocation=(), interest-cohort=(), payment=(self), usb=(), magnetometer=(), gyroscope=(), accelerometer=()",
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
   * Old offerings (cheap cohort / mentorship / online courses / student
   * dashboard / consultation booking) were retired when Skillies pivoted
   * to the funnel of: /workshop (selection day) → /program (the Batch).
   *
   * /workshop is alive again — it's the entry filter. /consultation
   * is dead — replaced by the workshop.
   */
  async redirects() {
    return [
      { source: "/consultation", destination: "/workshop", permanent: true },
      { source: "/consultation/:path*", destination: "/workshop", permanent: true },
      { source: "/mentorship", destination: "/program", permanent: true },
      { source: "/mentorship/:path*", destination: "/program", permanent: true },
      { source: "/courses", destination: "/program", permanent: true },
      { source: "/courses/:path*", destination: "/program", permanent: true },
      { source: "/dashboard", destination: "/program", permanent: true },
      { source: "/dashboard/:path*", destination: "/program", permanent: true },
      { source: "/learn", destination: "/program", permanent: true },
      { source: "/learn/:path*", destination: "/program", permanent: true },
    ];
  },
};

export default nextConfig;
